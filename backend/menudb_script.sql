CREATE DATABASE menu_db;

use menu_db;

CREATE TABLE categories (
    category_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(500),
    image_url VARCHAR(255),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_category_active (is_active),
    INDEX idx_category_display_order (display_order),
    INDEX idx_category_name (category_name)
)


CREATE TABLE menu_items (
    item_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    category_id BIGINT NOT NULL,
    item_name VARCHAR(150) NOT NULL,
    description TEXT(1000),
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    image_url VARCHAR(255),
    preparation_time INT, -- in minutes
    ingredients TEXT(1000),
    dietary_info VARCHAR(500), -- vegetarian, vegan, gluten-free, etc.
    calories INT,
    spice_level INT CHECK (spice_level BETWEEN 1 AND 5), -- 1-5 scale
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE CASCADE,
    
    INDEX idx_menu_item_category (category_id),
    INDEX idx_menu_item_available (is_available),
    INDEX idx_menu_item_featured (is_featured),
    INDEX idx_menu_item_price (price),
    INDEX idx_menu_item_spice_level (spice_level),
    INDEX idx_menu_item_display_order (display_order),
    INDEX idx_menu_item_name (item_name),
    INDEX idx_menu_item_preparation_time (preparation_time),
    
    UNIQUE KEY unique_item_per_category (item_name, category_id)
);


INSERT INTO categories (category_name, description, image_url, display_order) VALUES
('Appetizers', 'Start your meal with our delicious appetizers', '/images/categories/appetizers.jpg', 1),
('Main Courses', 'Hearty main dishes to satisfy your hunger', '/images/categories/main-courses.jpg', 2),
('Desserts', 'Sweet treats to end your meal perfectly', '/images/categories/desserts.jpg', 3),
('Beverages', 'Refreshing drinks and hot beverages', '/images/categories/beverages.jpg', 4),
('Salads', 'Fresh and healthy salad options', '/images/categories/salads.jpg', 5),
('Soups', 'Warm and comforting soup varieties', '/images/categories/soups.jpg', 6);



INSERT INTO menu_items (category_id, item_name, description, price, preparation_time, ingredients, dietary_info, calories, spice_level, is_featured, display_order) VALUES
(1, 'Spring Rolls', 'Fresh vegetables wrapped in rice paper, served with peanut dipping sauce', 8.99, 10, 'Rice paper, lettuce, carrots, cucumber, mint, peanut sauce', 'Vegetarian, Gluten-free', 180, 1, TRUE, 1),
(1, 'Chicken Wings', 'Crispy chicken wings tossed in buffalo sauce', 12.99, 15, 'Chicken wings, buffalo sauce, celery, blue cheese', 'None', 420, 3, FALSE, 2),
(1, 'Mozzarella Sticks', 'Golden fried mozzarella cheese with marinara sauce', 9.99, 8, 'Mozzarella cheese, breadcrumbs, marinara sauce', 'Vegetarian', 320, 1, FALSE, 3),

-- Main Courses
(2, 'Grilled Salmon', 'Fresh Atlantic salmon grilled to perfection with lemon herb seasoning', 24.99, 20, 'Atlantic salmon, lemon, herbs, olive oil', 'Gluten-free', 480, 1, TRUE, 1),
(2, 'Chicken Curry', 'Tender chicken in aromatic coconut curry sauce', 18.99, 25, 'Chicken, coconut milk, curry spices, onions, tomatoes', 'Gluten-free', 520, 4, TRUE, 2),
(2, 'Beef Steak', 'Prime cut ribeye steak cooked to your preference', 32.99, 18, 'Ribeye steak, garlic, rosemary, butter', 'Gluten-free', 680, 1, FALSE, 3),
(2, 'Vegetable Pasta', 'Fresh pasta with seasonal vegetables in garlic olive oil', 16.99, 15, 'Pasta, zucchini, bell peppers, tomatoes, garlic, olive oil', 'Vegetarian', 420, 2, FALSE, 4),

-- Desserts
(3, 'Chocolate Cake', 'Rich chocolate layer cake with ganache frosting', 7.99, 5, 'Chocolate, flour, eggs, butter, sugar', 'Vegetarian', 380, 1, TRUE, 1),
(3, 'Tiramisu', 'Classic Italian dessert with coffee-soaked ladyfingers', 8.99, 3, 'Mascarpone, coffee, ladyfingers, cocoa', 'Vegetarian', 340, 1, FALSE, 2),
(3, 'Ice Cream Sundae', 'Vanilla ice cream with chocolate sauce and whipped cream', 6.99, 2, 'Vanilla ice cream, chocolate sauce, whipped cream, cherry', 'Vegetarian', 280, 1, FALSE, 3),

-- Beverages
(4, 'Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 2, 'Fresh oranges', 'Vegan, Gluten-free', 120, 1, FALSE, 1),
(4, 'Coffee', 'Premium arabica coffee', 3.99, 3, 'Arabica coffee beans', 'Vegan, Gluten-free', 5, 1, FALSE, 2),
(4, 'Green Tea', 'Organic green tea', 3.49, 3, 'Green tea leaves', 'Vegan, Gluten-free', 2, 1, FALSE, 3),
(4, 'Mango Smoothie', 'Tropical mango smoothie with yogurt', 6.99, 5, 'Mango, yogurt, honey, ice', 'Vegetarian, Gluten-free', 180, 1, TRUE, 4),

-- Salads
(5, 'Caesar Salad', 'Classic Caesar salad with parmesan and croutons', 12.99, 8, 'Romaine lettuce, parmesan, croutons, Caesar dressing', 'Vegetarian', 220, 1, FALSE, 1),
(5, 'Greek Salad', 'Fresh vegetables with feta cheese and olives', 13.99, 10, 'Tomatoes, cucumber, olives, feta cheese, olive oil', 'Vegetarian, Gluten-free', 280, 1, TRUE, 2),
(5, 'Quinoa Salad', 'Healthy quinoa salad with mixed vegetables', 14.99, 12, 'Quinoa, bell peppers, cucumber, chickpeas, lemon dressing', 'Vegan, Gluten-free', 320, 1, FALSE, 3),

-- Soups
(6, 'Tomato Soup', 'Creamy tomato soup with fresh basil', 8.99, 10, 'Tomatoes, cream, basil, onions, garlic', 'Vegetarian', 180, 1, FALSE, 1),
(6, 'Chicken Noodle Soup', 'Classic comfort soup with tender chicken and noodles', 10.99, 15, 'Chicken, egg noodles, carrots, celery, onions', 'None', 240, 1, TRUE, 2),
(6, 'Lentil Soup', 'Hearty lentil soup with vegetables', 9.99, 20, 'Red lentils, carrots, onions, celery, spices', 'Vegan, Gluten-free', 220, 2, FALSE, 3);
menu_items

