use axum::Router;

use crate::state::AppState;

pub mod contact;
pub mod health;

pub fn router() -> Router<AppState> {
    Router::new()
        .merge(health::router())
        .merge(contact::router())
}
