-- Waig Pilot Database Schema
-- MySQL 5.7+ / MariaDB 10.3+

CREATE DATABASE IF NOT EXISTS `waigpilot` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `waigpilot`;

-- Users
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `avatar` TEXT DEFAULT NULL,
  `bio` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Sessions
CREATE TABLE IF NOT EXISTS `sessions` (
  `token` VARCHAR(128) PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Connected Accounts
CREATE TABLE IF NOT EXISTS `connected_accounts` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `account_id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` ENUM('FB Page', 'IG Business') NOT NULL,
  `access_token` TEXT NOT NULL,
  `token_expiry` TIMESTAMP NULL,
  `status` ENUM('Aktif', 'Perlu Re-auth', 'Terputus') NOT NULL DEFAULT 'Aktif',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Postings
CREATE TABLE IF NOT EXISTS `postings` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `connected_account_id` INT UNSIGNED DEFAULT NULL,
  `media_url` TEXT DEFAULT NULL,
  `caption` TEXT NOT NULL,
  `scheduled_at` TIMESTAMP NOT NULL,
  `platform` ENUM('Instagram', 'Facebook') NOT NULL,
  `status` ENUM('Terjadwal', 'Sukses', 'Gagal') NOT NULL DEFAULT 'Terjadwal',
  `error_message` TEXT DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE,
  FOREIGN KEY (`connected_account_id`) REFERENCES `connected_accounts`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB;

-- Activity Logs
CREATE TABLE IF NOT EXISTS `activity_logs` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `action` VARCHAR(100) NOT NULL,
  `description` TEXT DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Export History
CREATE TABLE IF NOT EXISTS `export_history` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `user_id` INT UNSIGNED NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `range_text` VARCHAR(255) DEFAULT NULL,
  `format` VARCHAR(10) NOT NULL DEFAULT 'CSV',
  `status` ENUM('Diproses', 'Selesai', 'Gagal') NOT NULL DEFAULT 'Diproses',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Seed admin user (password: admin123)
INSERT IGNORE INTO `users` (`id`, `name`, `email`, `password`, `role`, `is_active`, `bio`)
VALUES (1, 'Budi Santoso', 'admin@waigpilot.io', 'admin123', 'admin', 1, 'Administrator utama Waig Pilot.');
