use axum::Router;
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use tower_http::trace::TraceLayer;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod db;
mod email;
mod routes;
mod state;

use state::AppState;

#[tokio::main]
async fn main() {
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| "webjuanma_api=info,tower_http=info,sqlx=warn".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    dotenvy::dotenv().ok();

    let config = config::AppConfig::from_env();
    let port = config.port;

    let pool = db::init_pool(&config.database_url)
        .await
        .expect("Failed to initialize SQLite pool / run migrations");
    tracing::info!("📚 SQLite pool ready at {}", config.database_url);

    let cors = CorsLayer::new()
        .allow_origin(config.cors_origins())
        .allow_methods(Any)
        .allow_headers(Any);

    let state = AppState { config, pool };

    let app = Router::new()
        .merge(routes::router())
        .layer(cors)
        .layer(TraceLayer::new_for_http())
        .with_state(state);

    let addr = SocketAddr::from(([0, 0, 0, 0], port));
    tracing::info!("🚀 WebJuanma API running on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
