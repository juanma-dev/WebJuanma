use std::env;
use tower_http::cors::AllowOrigin;

/// Application configuration loaded from environment variables.
#[derive(Clone, Debug)]
pub struct AppConfig {
    pub port: u16,
    pub cors_origin: String,

    // Database
    pub database_url: String,

    // SMTP
    pub smtp_host: String,
    pub smtp_port: u16,
    pub smtp_user: String,
    pub smtp_pass: String,

    // Contact
    pub contact_to_email: String,
}

impl AppConfig {
    /// Load configuration from environment variables with sensible defaults.
    pub fn from_env() -> Self {
        Self {
            port: env::var("PORT")
                .unwrap_or_else(|_| "8080".into())
                .parse()
                .expect("PORT must be a valid u16"),

            cors_origin: env::var("CORS_ORIGIN")
                .unwrap_or_else(|_| "http://localhost:3000".into()),

            database_url: env::var("DATABASE_URL")
                .unwrap_or_else(|_| "sqlite://webjuanma.db".into()),

            smtp_host: env::var("SMTP_HOST")
                .unwrap_or_else(|_| "smtp.gmail.com".into()),

            smtp_port: env::var("SMTP_PORT")
                .unwrap_or_else(|_| "587".into())
                .parse()
                .expect("SMTP_PORT must be a valid u16"),

            smtp_user: env::var("SMTP_USER")
                .unwrap_or_else(|_| {
                    tracing::warn!("SMTP_USER not set — emails will not be sent");
                    String::new()
                }),

            smtp_pass: env::var("SMTP_PASS")
                .unwrap_or_else(|_| {
                    tracing::warn!("SMTP_PASS not set — emails will not be sent");
                    String::new()
                }),

            contact_to_email: env::var("CONTACT_TO_EMAIL")
                .unwrap_or_else(|_| "websjuanma@gmail.com".into()),
        }
    }

    /// Parse CORS origins from the comma-separated CORS_ORIGIN env var.
    pub fn cors_origins(&self) -> AllowOrigin {
        let origins: Vec<_> = self.cors_origin
            .split(',')
            .map(|s| s.trim().parse().expect("Invalid CORS origin"))
            .collect();
        AllowOrigin::list(origins)
    }

    /// Check if SMTP is properly configured.
    pub fn smtp_configured(&self) -> bool {
        !self.smtp_user.is_empty() && !self.smtp_pass.is_empty()
    }
}
