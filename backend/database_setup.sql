-- Buat database
CREATE DATABASE IF NOT EXISTS hy_yume_db;
USE hy_yume_db;

-- Tabel users akan dibuat otomatis oleh Sequelize
-- Tabel sensor_data akan dibuat otomatis oleh Sequelize

-- Atau bisa juga membuat manual:
/*
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE sensor_data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    suhu_air FLOAT NOT NULL,
    suhu_udara FLOAT NOT NULL,
    kelembapan FLOAT NOT NULL,
    tds FLOAT NOT NULL,
    ph FLOAT NULL,
    pompa VARCHAR(10) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
*/