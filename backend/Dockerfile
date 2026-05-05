# ---- Stage 1: Build ----
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

# ---- Stage 2: Runtime ----
FROM debian:bookworm-slim

RUN apt-get update && apt-get install -y --no-install-recommends \
        ca-certificates libssl3 \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/data

WORKDIR /app
COPY --from=builder /app/target/release/webjuanma-api .

EXPOSE 8080
ENV RUST_LOG=webjuanma_api=info,tower_http=info,sqlx=warn \
    DATABASE_URL=sqlite:///app/data/webjuanma.db

VOLUME ["/app/data"]

CMD ["./webjuanma-api"]
