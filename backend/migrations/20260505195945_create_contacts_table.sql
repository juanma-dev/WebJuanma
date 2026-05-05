CREATE TABLE IF NOT EXISTS contacts (
    id         TEXT PRIMARY KEY NOT NULL,
    name       TEXT NOT NULL,
    email      TEXT NOT NULL,
    phone      TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_contacts_created_at
    ON contacts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_contacts_email
    ON contacts(email);
