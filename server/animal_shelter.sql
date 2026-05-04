CREATE DATABASE IF NOT EXISTS animal_shelter;
USE animal_shelter;

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    login VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar LONGTEXT,
    role VARCHAR(50) DEFAULT 'user',
    is_diia_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) NOT NULL,
    help_type VARCHAR(50), 
    target_type VARCHAR(50), 
    
    animal_name VARCHAR(100),
    animal_type VARCHAR(100),
    gender VARCHAR(50),
    breed VARCHAR(100),
    age VARCHAR(50),
    weight VARCHAR(50),
    height VARCHAR(50),
    color VARCHAR(50),
    health VARCHAR(255),
    documents VARCHAR(255),
    
    org_name VARCHAR(255),
    org_type VARCHAR(100),
    org_city VARCHAR(100),
    org_address VARCHAR(255),
    provider_name VARCHAR(255),
    region VARCHAR(100),
    
    requisites VARCHAR(255),
    keeper_phone VARCHAR(50),
    image LONGTEXT,
    
    status VARCHAR(50) DEFAULT 'pending',
    admin_comment TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS donations (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'UAH',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'UAH',
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);