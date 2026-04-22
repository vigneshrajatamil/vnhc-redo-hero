CREATE DATABASE IF NOT EXISTS vnhc_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE vnhc_db;

CREATE TABLE IF NOT EXISTS vnhc_admin_user (
  id CHAR(32) NOT NULL,
  username VARCHAR(150) NOT NULL,
  email VARCHAR(254) NOT NULL,
  password_hash VARCHAR(256) NOT NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  UNIQUE KEY uq_vnhc_admin_user_username (username),
  UNIQUE KEY uq_vnhc_admin_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vnhc_contact_message (
  id CHAR(32) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(254) NOT NULL,
  phone VARCHAR(20) DEFAULT NULL,
  subject VARCHAR(255) DEFAULT NULL,
  message LONGTEXT NOT NULL,
  is_read TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_vnhc_contact_message_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vnhc_gallery_item (
  id CHAR(32) NOT NULL,
  title VARCHAR(255) DEFAULT NULL,
  file VARCHAR(100) NOT NULL,
  is_video TINYINT(1) NOT NULL DEFAULT 0,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_vnhc_gallery_item_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS vnhc_product (
  id CHAR(32) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT DEFAULT NULL,
  category VARCHAR(100) NOT NULL,
  tag VARCHAR(100) DEFAULT NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  weight VARCHAR(50) DEFAULT NULL,
  sku VARCHAR(100) DEFAULT NULL,
  stock_status VARCHAR(20) NOT NULL DEFAULT 'in_stock',
  image VARCHAR(100) DEFAULT NULL,
  created_by_id CHAR(32) DEFAULT NULL,
  created_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  updated_at DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  PRIMARY KEY (id),
  KEY idx_vnhc_product_created_at (created_at),
  KEY idx_vnhc_product_created_by (created_by_id),
  CONSTRAINT fk_vnhc_product_created_by
    FOREIGN KEY (created_by_id) REFERENCES vnhc_admin_user (id)
    ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS django_session (
  session_key VARCHAR(40) NOT NULL,
  session_data LONGTEXT NOT NULL,
  expire_date DATETIME(6) NOT NULL,
  PRIMARY KEY (session_key),
  KEY django_session_expire_date_a5c62663 (expire_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
