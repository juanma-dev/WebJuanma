use lettre::{
    message::header::ContentType,
    transport::smtp::authentication::Credentials,
    AsyncSmtpTransport, AsyncTransport, Message, Tokio1Executor,
};

use crate::config::AppConfig;
use crate::routes::contact::ContactRequest;

/// Send a contact notification email via Gmail SMTP.
pub async fn send_contact_email(config: &AppConfig, contact: &ContactRequest) -> Result<(), String> {
    if !config.smtp_configured() {
        tracing::warn!("SMTP not configured — skipping email, logging contact instead");
        tracing::info!(
            "📧 Contact form: name={}, email={}, phone={}, message={}",
            contact.name, contact.email, contact.phone, contact.message
        );
        return Ok(());
    }

    let html_body = format!(
        r#"<!DOCTYPE html>
<html>
<head>
  <style>
    body {{ font-family: 'Segoe UI', Tahoma, sans-serif; background: #0a0e17; color: #e0e0e0; padding: 20px; }}
    .container {{ max-width: 600px; margin: 0 auto; background: #111827; border-radius: 12px; padding: 32px; border: 1px solid #1e293b; }}
    h1 {{ color: #0c64e3; font-size: 24px; margin-bottom: 24px; }}
    .field {{ margin-bottom: 16px; }}
    .label {{ font-size: 12px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }}
    .value {{ font-size: 16px; color: #f1f5f9; padding: 8px 12px; background: #1e293b; border-radius: 8px; }}
    .message {{ white-space: pre-wrap; line-height: 1.6; }}
    .footer {{ margin-top: 24px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; }}
  </style>
</head>
<body>
  <div class="container">
    <h1>📬 Nuevo mensaje de contacto</h1>
    <div class="field">
      <div class="label">Nombre</div>
      <div class="value">{name}</div>
    </div>
    <div class="field">
      <div class="label">Email</div>
      <div class="value"><a href="mailto:{email}" style="color: #0c64e3;">{email}</a></div>
    </div>
    <div class="field">
      <div class="label">Teléfono</div>
      <div class="value"><a href="tel:{phone}" style="color: #08bc08;">{phone}</a></div>
    </div>
    <div class="field">
      <div class="label">Mensaje</div>
      <div class="value message">{message}</div>
    </div>
    <div class="footer">
      Enviado desde webjuanma.com — WebJuanma API
    </div>
  </div>
</body>
</html>"#,
        name = html_escape(&contact.name),
        email = html_escape(&contact.email),
        phone = html_escape(&contact.phone),
        message = html_escape(&contact.message),
    );

    let email = Message::builder()
        .from(config.smtp_user.parse().map_err(|e| format!("Invalid from address: {e}"))?)
        .to(config.contact_to_email.parse().map_err(|e| format!("Invalid to address: {e}"))?)
        .reply_to(contact.email.parse().map_err(|e| format!("Invalid reply-to address: {e}"))?)
        .subject(format!("🌐 WebJuanma — Nuevo contacto de {}", contact.name))
        .header(ContentType::TEXT_HTML)
        .body(html_body)
        .map_err(|e| format!("Failed to build email: {e}"))?;

    let creds = Credentials::new(config.smtp_user.clone(), config.smtp_pass.clone());

    let mailer = AsyncSmtpTransport::<Tokio1Executor>::starttls_relay(&config.smtp_host)
        .map_err(|e| format!("Failed to create SMTP transport: {e}"))?
        .port(config.smtp_port)
        .credentials(creds)
        .build();

    mailer.send(email).await
        .map_err(|e| format!("Failed to send email: {e}"))?;

    tracing::info!("✅ Contact email sent for: {}", contact.name);
    Ok(())
}

/// Basic HTML escaping to prevent injection.
fn html_escape(input: &str) -> String {
    input
        .replace('&', "&amp;")
        .replace('<', "&lt;")
        .replace('>', "&gt;")
        .replace('"', "&quot;")
        .replace('\'', "&#x27;")
}
