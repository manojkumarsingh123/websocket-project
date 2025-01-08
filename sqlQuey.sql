-- Organizations Table
CREATE TABLE organizations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'user',
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on frequently queried fields
CREATE INDEX idx_users_organization_id ON users(organization_id);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Chat Rooms Table
CREATE TABLE chat_rooms (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    organization_id INT REFERENCES organizations(id) ON DELETE CASCADE,
    created_by INT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on frequently queried fields
CREATE INDEX idx_chat_rooms_organization_id ON chat_rooms(organization_id);
CREATE INDEX idx_chat_rooms_created_at ON chat_rooms(created_at);

-- Messages Table
CREATE TABLE chat_messages (
    id SERIAL PRIMARY KEY,
    chat_room_id INT REFERENCES chat_rooms(id) ON DELETE CASCADE,
    user_id INT REFERENCES users(id),
    content TEXT NOT NULL,
    is_encrypted BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index on frequently queried fields
CREATE INDEX idx_messages_chat_room_id ON messages(chat_room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
