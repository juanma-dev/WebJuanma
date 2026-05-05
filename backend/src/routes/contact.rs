use std::collections::HashMap;

use axum::{
    extract::State,
    http::StatusCode,
    routing::post,
    Json, Router,
};
use serde::{Deserialize, Serialize};
use uuid::Uuid;
use validator::Validate;

use crate::email;
use crate::state::AppState;

#[derive(Debug, Deserialize, Validate)]
pub struct ContactRequest {
    #[validate(length(min = 1, max = 100, code = "name_required"))]
    pub name: String,

    #[validate(length(min = 7, max = 20, code = "phone_invalid"))]
    pub phone: String,

    #[validate(email(code = "email_invalid"))]
    pub email: String,

    #[validate(length(min = 1, max = 2000, code = "message_required"))]
    pub message: String,

    /// Honeypot field. Real users leave it empty; bots fill it.
    #[serde(default)]
    pub website: Option<String>,
}

#[derive(Serialize)]
pub struct ContactResponse {
    pub success: bool,
    pub code: &'static str,
    pub message: &'static str,
    #[serde(rename = "fieldErrors", skip_serializing_if = "Option::is_none")]
    pub field_errors: Option<HashMap<String, String>>,
}

impl ContactResponse {
    fn ok(code: &'static str, message: &'static str) -> Self {
        Self { success: true, code, message, field_errors: None }
    }
    fn err(code: &'static str, message: &'static str) -> Self {
        Self { success: false, code, message, field_errors: None }
    }
}

async fn handle_contact(
    State(state): State<AppState>,
    Json(payload): Json<ContactRequest>,
) -> (StatusCode, Json<ContactResponse>) {
    // Honeypot — silently accept and skip side-effects so bots think they succeeded.
    if payload.website.as_deref().is_some_and(|s| !s.trim().is_empty()) {
        tracing::warn!("🕷️ Honeypot triggered from {}", payload.email);
        return (
            StatusCode::OK,
            Json(ContactResponse::ok("sent", "Message sent successfully")),
        );
    }

    if let Err(errors) = payload.validate() {
        let mut field_errors: HashMap<String, String> = HashMap::new();
        for (field, errs) in errors.field_errors() {
            if let Some(first) = errs.first() {
                field_errors.insert(field.to_string(), first.code.to_string());
            }
        }
        return (
            StatusCode::BAD_REQUEST,
            Json(ContactResponse {
                success: false,
                code: "validation_error",
                message: "One or more fields are invalid.",
                field_errors: Some(field_errors),
            }),
        );
    }

    let id = Uuid::new_v4().to_string();

    if let Err(e) = sqlx::query(
        "INSERT INTO contacts (id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(&id)
    .bind(&payload.name)
    .bind(&payload.email)
    .bind(&payload.phone)
    .bind(&payload.message)
    .execute(&state.pool)
    .await
    {
        tracing::error!("❌ Failed to persist contact: {e}");
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ContactResponse::err(
                "db_error",
                "Could not save your message. Please try again.",
            )),
        );
    }

    tracing::info!(
        "💾 Contact saved id={} from={} ({})",
        id,
        payload.name,
        payload.email
    );

    match email::send_contact_email(&state.config, &payload).await {
        Ok(()) => (
            StatusCode::OK,
            Json(ContactResponse::ok("sent", "Message sent successfully.")),
        ),
        Err(e) => {
            tracing::error!("⚠️  Email failed (data is saved id={id}): {e}");
            (
                StatusCode::OK,
                Json(ContactResponse::ok(
                    "saved_pending_email",
                    "Saved your message. Email notification is pending.",
                )),
            )
        }
    }
}

pub fn router() -> Router<AppState> {
    Router::new().route("/api/contact", post(handle_contact))
}

#[cfg(test)]
mod tests {
    use super::*;
    use validator::Validate;

    fn base() -> ContactRequest {
        ContactRequest {
            name: "Juan Ma".into(),
            phone: "3150533698".into(),
            email: "test@example.com".into(),
            message: "Hola, quiero una página web".into(),
            website: None,
        }
    }

    #[test]
    fn test_valid_contact_request() {
        assert!(base().validate().is_ok());
    }

    #[test]
    fn test_invalid_email() {
        let mut r = base();
        r.email = "not-an-email".into();
        let err = r.validate().unwrap_err();
        assert!(err.field_errors().contains_key("email"));
    }

    #[test]
    fn test_empty_name() {
        let mut r = base();
        r.name = "".into();
        let err = r.validate().unwrap_err();
        assert!(err.field_errors().contains_key("name"));
    }

    #[test]
    fn test_phone_too_short() {
        let mut r = base();
        r.phone = "123".into();
        let err = r.validate().unwrap_err();
        assert_eq!(err.field_errors()["phone"][0].code, "phone_invalid");
    }
}
