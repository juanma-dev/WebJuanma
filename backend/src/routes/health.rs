use axum::{routing::get, Json, Router};
use serde::Serialize;

use crate::state::AppState;

#[derive(Serialize)]
struct HealthResponse {
    status: &'static str,
    version: &'static str,
    service: &'static str,
}

async fn health_check() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok",
        version: env!("CARGO_PKG_VERSION"),
        service: "webjuanma-api",
    })
}

pub fn router() -> Router<AppState> {
    Router::new().route("/api/health", get(health_check))
}
