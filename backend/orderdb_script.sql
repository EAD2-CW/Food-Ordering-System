CREATE DATABASE IF NOT EXISTS order_db;
USE order_db;

CREATE TABLE orders (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DISPATCHED', 'DELIVERED', 'CANCELLED') DEFAULT 'PENDING',
    order_type ENUM('DELIVERY', 'PICKUP', 'DINE_IN') DEFAULT 'DELIVERY',
    delivery_address TEXT NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    special_instructions TEXT,
    estimated_delivery_time DATETIME NULL,
    created_at DATETIME NOT NULL,
    updated_at DATETIME NOT NULL
);

CREATE INDEX idx_user_id ON orders(user_id);
CREATE INDEX idx_status ON orders(status);
CREATE INDEX idx_created_at ON orders(created_at);
CREATE INDEX idx_order_number ON orders(order_number);


CREATE TABLE order_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    menu_item_id BIGINT NOT NULL,
    menu_item_name VARCHAR(100) NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);

CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_menu_item_id ON order_items(menu_item_id);

CREATE TABLE order_status_history (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    order_id BIGINT NOT NULL,
    status ENUM('PENDING', 'CONFIRMED', 'PREPARING', 'READY', 'DISPATCHED', 'DELIVERED', 'CANCELLED') NOT NULL,
    changed_by BIGINT,
    notes TEXT,
    created_at DATETIME NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
);


CREATE INDEX idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX idx_order_status_history_status ON order_status_history(status);


INSERT INTO orders (user_id, order_number, total_amount, status, delivery_address, phone_number, special_instructions, estimated_delivery_time, created_at, updated_at) VALUES
(1, 'ORD1672934567890', 25.99, 'PENDING', '123 Main St, City, State 12345', '123-456-7890', 'Please ring doorbell', DATE_ADD(NOW(), INTERVAL 30 MINUTE), NOW(), NOW()),
(2, 'ORD1672934567891', 18.50, 'CONFIRMED', '456 Oak Ave, City, State 12345', '098-765-4321', 'Leave at door', DATE_ADD(NOW(), INTERVAL 45 MINUTE), NOW(), NOW()),
(1, 'ORD1672934567892', 32.75, 'PREPARING', '789 Pine St, City, State 12345', '123-456-7890', NULL, DATE_ADD(NOW(), INTERVAL 25 MINUTE), NOW(), NOW());



INSERT INTO order_items (order_id, menu_item_id, menu_item_name, quantity, unit_price, total_price, created_at) VALUES
(1, 1, 'Margherita Pizza', 1, 15.99, 15.99, NOW()),
(1, 4, 'Coca Cola', 2, 2.50, 5.00, NOW()),
(1, 6, 'Garlic Bread', 1, 4.99, 4.99, NOW()),
(2, 2, 'Chicken Burger', 1, 12.99, 12.99, NOW()),
(2, 3, 'French Fries', 1, 5.50, 5.50, NOW()),
(3, 1, 'Margherita Pizza', 2, 15.99, 31.98, NOW()),
(3, 5, 'Caesar Salad', 1, 8.99, 8.99, NOW());


INSERT INTO order_status_history (order_id, status, notes, created_at) VALUES
(1, 'PENDING', 'Order placed', NOW()),
(2, 'PENDING', 'Order placed', NOW()),
(2, 'CONFIRMED', 'Order confirmed by restaurant', NOW()),
(3, 'PENDING', 'Order placed', NOW()),
(3, 'CONFIRMED', 'Order confirmed by restaurant', NOW()),
(3, 'PREPARING', 'Kitchen started preparing order', NOW());


