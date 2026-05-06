# syntax=docker/dockerfile:1.7

# ---- Stage 1: build ----
FROM rust:1.83-slim-bookworm AS builder

RUN apt-get update && apt-get install -y --no-install-recommends \
        pkg-config libssl-dev build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Cache dependency compilation
COPY Cargo.toml Cargo.lock ./
RUN mkdir src && echo "fn main() {}" > src/main.rs
RUN cargo build --release
RUN rm -rf src

# Real build (migrations dir is required because `sqlx::migrate!` embeds .sql files at compile time)
COPY src ./src
COPY migrations ./migrations
RUN touch src/main.rs && cargo build --release

# ---- Stage 2: runtime ----
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates libssl3 \
    && rm -rf /var/lib/apt/lists/* \
    && groupadd --system --gid 1000 webjuanma \
    && useradd  --system --uid 1000 --gid webjuanma --create-home webjuanma \
    && mkdir -p /app/data \
    && chown -R webjuanma:webjuanma /app

WORKDIR /app
COPY --from=builder --chown=webjuanma:webjuanma /app/target/release/webjuanma-api .

USER webjuanma
EXPOSE 8080

ENV RUST_LOG=webjuanma_api=info,tower_http=info,sqlx=warn \
    DATABASE_URL=sqlite:///app/data/webjuanma.db

VOLUME ["/app/data"]

CMD ["./webjuanma-api"]
