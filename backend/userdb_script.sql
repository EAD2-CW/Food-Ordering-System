CREATE DATABASE user_db
USE user_db;


CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    address TEXT,
    role ENUM('CUSTOMER', 'ADMIN', 'STAFF') DEFAULT 'CUSTOMER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


INSERT IGNORE INTO users (email, password, first_name, last_name, phone_number, address, role) 
VALUES ('admin@foodordering.com', 'admin123', 'System', 'Administrator', '0000000000', 'Admin Office', 'ADMIN');


INSERT IGNORE INTO users (email, password, first_name, last_name, phone_number, address, role) 
VALUES ('staff@foodordering.com', 'staff123', 'Kitchen', 'Staff', '1111111111', 'Restaurant Kitchen', 'STAFF');

INSERT IGNORE INTO users (email, password, first_name, last_name, phone_number, address, role) 
VALUES 
('john.doe@example.com', 'password123', 'John', 'Doe', '1234567890', '123 Main Street, Colombo', 'CUSTOMER'),
('jane.smith@example.com', 'password123', 'Jane', 'Smith', '0987654321', '456 Oak Avenue, Kandy', 'CUSTOMER'),
('mike.wilson@example.com', 'password123', 'Mike', 'Wilson', '5555555555', '789 Pine Road, Galle', 'CUSTOMER');
