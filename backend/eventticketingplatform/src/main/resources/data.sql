-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Clear existing data
DELETE FROM reviews;
DELETE FROM payments;
DELETE FROM order_items;
DELETE FROM orders;
DELETE FROM ticket_types;
DELETE FROM events;
DELETE FROM venues;
DELETE FROM categories;
DELETE FROM users_roles;
DELETE FROM users;
DELETE FROM roles;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Insert Roles
INSERT INTO roles (id, name) VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_ORGANIZER'),
(3, 'ROLE_ADMIN');

-- Insert Categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Bar', 'Live music, DJ sets and bar events'),
(2, 'Stadium', 'Sports events and large concerts'),
(3, 'Theater', 'Theater performances and cultural shows'),
(4, 'Conference', 'Business conferences and seminars'),
(5, 'Festival', 'Music festivals and outdoor events');

-- Insert Venues
INSERT INTO venues (id, name, address, city, capacity) VALUES
(1, 'YOU Concert Hall', 'Tsimiski 45', 'Thessaloniki', 1000),
(2, 'Kolokotronis Stadium', 'Leoforos Kifisias 120', 'Athens', 100000),
(3, 'The Pub', 'Koroneou 23', 'Heraklion', 100),
(4, 'Thessaloniki Theater', 'Aristotelous Square 12', 'Thessaloniki', 1000),
(5, 'Athens Music Arena', 'Syngrou Avenue 234', 'Athens', 5000),
(6, 'Patras Festival Grounds', 'Harbourfront', 'Patras', 10000),
(7, 'Mykonos Beach Club', 'Paradise Beach', 'Mykonos', 500),
(8, 'Rhodes Conference Center', 'Mandraki Port', 'Rhodes', 2000);

-- Insert Users (password for all: "password123")
-- Password hash: $2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u

-- Regular Users (1-10)
INSERT INTO users (id, name, email, password, phone_number, is_active) VALUES
(1, 'User 1', 'user1@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345601', true),
(2, 'User 2', 'user2@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345602', true),
(3, 'User 3', 'user3@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345603', true),
(4, 'User 4', 'user4@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345604', true),
(5, 'User 5', 'user5@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345605', true),
(6, 'User 6', 'user6@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345606', true),
(7, 'User 7', 'user7@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345607', true),
(8, 'User 8', 'user8@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345608', true),
(9, 'User 9', 'user9@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345609', true),
(10, 'User 10', 'user10@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345610', true);

-- Organizers (11-15)
INSERT INTO users (id, name, email, password, phone_number, is_active) VALUES
(11, 'Organizer 1', 'organizer1@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345601', true),
(12, 'Organizer 2', 'organizer2@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345602', true),
(13, 'Organizer 3', 'organizer3@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345603', true),
(14, 'Organizer 4', 'organizer4@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345604', true),
(15, 'Organizer 5', 'organizer5@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345605', true);

-- Admins (16-18)
INSERT INTO users (id, name, email, password, phone_number, is_active) VALUES
(16, 'Admin 1', 'admin1@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6932345601', true),
(17, 'Admin 2', 'admin2@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6932345602', true),
(18, 'Admin 3', 'admin3@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6932345603', true);

-- Assign Roles
INSERT INTO users_roles (user_id, role_id) VALUES
-- Regular users
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
-- Organizers
(11, 2), (12, 2), (13, 2), (14, 2), (15, 2),
-- Admins
(16, 3), (17, 3), (18, 3);

-- Insert PAST Events
INSERT INTO events (id, title, description, event_date, event_time, category_id, venue_id, organizer_id, status, image_url) VALUES
(1, 'New Year Rock Concert 2025', 'Amazing rock concert to celebrate the new year', '2025-01-01', '22:00:00', 1, 1, 11, 'APPROVED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'),
(2, 'Winter Jazz Festival', 'Smooth jazz performances by top Greek artists', '2025-12-15', '20:00:00', 1, 5, 11, 'APPROVED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'),
(3, 'Christmas Theater Play', 'A heartwarming Christmas story for all ages', '2025-12-20', '19:00:00', 3, 4, 12, 'APPROVED', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'),
(4, 'Tech Conference Athens 2025', 'Annual technology and innovation conference', '2025-11-10', '09:00:00', 4, 8, 13, 'APPROVED', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
(5, 'Halloween Party', 'Spooky night with DJ and costume contest', '2025-10-31', '23:00:00', 1, 3, 11, 'APPROVED', 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800'),
(6, 'Summer Music Festival', 'Three-day outdoor music festival', '2025-08-15', '18:00:00', 5, 6, 14, 'APPROVED', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'),
(7, 'Comedy Night Special', 'Stand-up comedy with famous Greek comedians', '2025-09-20', '21:00:00', 3, 4, 12, 'APPROVED', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800'),
(8, 'Panathinaikos vs Olympiacos Derby', 'Historic football match', '2025-12-01', '19:00:00', 2, 2, 15, 'APPROVED', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800'),
(9, 'Spring Concert 2025', 'Classical music concert', '2025-05-20', '20:00:00', 3, 1, 11, 'APPROVED', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800'),
(10, 'Beach Party Mykonos', 'Summer beach party', '2025-07-10', '22:00:00', 5, 7, 14, 'APPROVED', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800');

-- Insert UPCOMING Events
INSERT INTO events (id, title, description, event_date, event_time, category_id, venue_id, organizer_id, status, image_url) VALUES
(11, 'Summer DJ Set - Electro Night', 'Electronic music night with top Greek DJs', '2026-01-15', '23:00:00', 1, 3, 11, 'APPROVED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800'),
(12, 'Rembetika Live - Vassilis Tsitsanis Tribute', 'Traditional Greek rembetika music', '2026-01-20', '21:00:00', 1, 1, 11, 'APPROVED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800'),
(13, 'Greek Hip Hop Festival', 'Featuring top Greek hip hop artists', '2026-02-10', '20:00:00', 1, 1, 12, 'APPROVED', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800'),
(14, 'Olympiacos vs PAOK - Greek Super League', 'Epic football rivalry match', '2026-01-25', '19:00:00', 2, 2, 15, 'APPROVED', 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800'),
(15, 'AEK vs Panathinaikos - Athens Derby', 'The eternal Athens derby', '2026-02-08', '20:00:00', 2, 2, 15, 'APPROVED', 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=800'),
(16, 'Ancient Greek Tragedy - Antigone', 'Classic Sophocles tragedy', '2026-01-18', '20:30:00', 3, 4, 12, 'APPROVED', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800'),
(17, 'Greek Comedy Night - Logia Timis', 'Modern Greek comedy', '2026-02-22', '21:00:00', 3, 4, 12, 'APPROVED', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800'),
(18, 'Chill Vibes DJ Set', 'Relaxed evening with deep house', '2026-02-01', '22:00:00', 1, 3, 11, 'APPROVED', 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800'),
(19, 'Spring Tech Summit 2026', 'AI and Machine Learning conference', '2026-03-15', '09:00:00', 4, 8, 13, 'APPROVED', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'),
(20, 'Mykonos Summer Party', 'Beach party with international DJs', '2026-07-20', '22:00:00', 5, 7, 14, 'APPROVED', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'),
(21, 'Classical Music Evening', 'Symphony orchestra performance', '2026-02-28', '20:00:00', 3, 4, 12, 'APPROVED', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800'),
(22, 'Startup Pitch Night', 'Entrepreneurs showcase their startups', '2026-03-10', '18:00:00', 4, 8, 13, 'APPROVED', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800');

-- Ticket Types for PAST Events (1-10)
INSERT INTO ticket_types (id, event_id, name, price, total_quantity, quantity_available) VALUES
(1, 1, 'General Admission', 25.00, 500, 50),
(2, 1, 'VIP', 50.00, 100, 10),
(3, 2, 'General Admission', 30.00, 800, 100),
(4, 2, 'VIP', 60.00, 200, 50),
(5, 3, 'Regular', 20.00, 500, 50),
(6, 3, 'Student', 12.00, 200, 20),
(7, 4, 'Standard', 80.00, 1000, 100),
(8, 4, 'Premium', 150.00, 200, 20),
(9, 5, 'General Admission', 15.00, 100, 0),
(10, 6, 'Day Pass', 50.00, 2000, 200),
(11, 6, '3-Day Pass', 120.00, 1000, 100),
(12, 7, 'Regular', 25.00, 600, 50),
(13, 7, 'Student', 15.00, 200, 20),
(14, 8, 'Normal Seat', 30.00, 80000, 10000),
(15, 8, 'Premium Seat', 90.00, 20000, 2000),
(16, 9, 'General Admission', 35.00, 800, 100),
(17, 9, 'VIP', 70.00, 200, 50),
(18, 10, 'General Entry', 40.00, 500, 50);

-- Ticket Types for UPCOMING Events (11-22)
INSERT INTO ticket_types (id, event_id, name, price, total_quantity, quantity_available) VALUES
(19, 11, 'General Admission', 15.00, 100, 100),
(20, 12, 'General Admission', 30.00, 600, 600),
(21, 12, 'VIP', 60.00, 150, 150),
(22, 12, 'Early Bird', 22.00, 250, 250),
(23, 13, 'General Admission', 35.00, 700, 700),
(24, 13, 'Early Bird', 25.00, 300, 300),
(25, 14, 'Normal Seat', 25.00, 80000, 80000),
(26, 14, 'Premium Seat', 80.00, 20000, 20000),
(27, 15, 'Normal Seat', 30.00, 75000, 75000),
(28, 15, 'Premium Seat', 90.00, 25000, 25000),
(29, 16, 'Early Bird', 18.00, 200, 200),
(30, 16, 'Regular', 25.00, 500, 500),
(31, 16, 'Reduced', 12.00, 250, 250),
(32, 17, 'Early Bird', 15.00, 200, 200),
(33, 17, 'Regular', 20.00, 500, 500),
(34, 18, 'General Admission', 12.00, 100, 100),
(35, 19, 'Standard', 100.00, 1500, 1500),
(36, 19, 'VIP', 250.00, 300, 300),
(37, 20, 'General Entry', 40.00, 500, 500),
(38, 21, 'Regular', 35.00, 800, 800),
(39, 21, 'Student', 20.00, 200, 200),
(40, 22, 'General', 10.00, 150, 150);

-- Insert PAST Orders
INSERT INTO orders (id, user_id, event_id, total_amount, status, order_date) VALUES
(1, 1, 1, 75.00, 'CONFIRMED', '2024-12-28 10:00:00'),
(2, 1, 2, 90.00, 'CONFIRMED', '2025-12-10 14:00:00'),
(3, 1, 3, 32.00, 'CONFIRMED', '2025-12-15 16:00:00'),
(4, 1, 5, 45.00, 'CONFIRMED', '2025-10-25 12:00:00'),
(5, 1, 6, 120.00, 'CONFIRMED', '2025-08-10 11:00:00'),
(6, 1, 9, 105.00, 'CONFIRMED', '2025-05-15 10:00:00'),
(7, 2, 1, 50.00, 'CONFIRMED', '2024-12-29 09:00:00'),
(8, 2, 3, 40.00, 'CONFIRMED', '2025-12-18 15:00:00'),
(9, 2, 4, 230.00, 'CONFIRMED', '2025-11-05 10:00:00'),
(10, 2, 7, 40.00, 'CONFIRMED', '2025-09-15 13:00:00'),
(11, 2, 10, 80.00, 'CONFIRMED', '2025-07-08 11:00:00'),
(12, 3, 2, 120.00, 'CONFIRMED', '2025-12-12 11:00:00'),
(13, 3, 5, 30.00, 'CONFIRMED', '2025-10-28 14:00:00'),
(14, 3, 8, 120.00, 'CONFIRMED', '2025-11-28 16:00:00'),
(15, 3, 9, 70.00, 'CONFIRMED', '2025-05-18 12:00:00'),
(16, 4, 6, 240.00, 'CONFIRMED', '2025-08-12 10:00:00'),
(17, 4, 7, 50.00, 'CONFIRMED', '2025-09-18 12:00:00'),
(18, 4, 10, 80.00, 'CONFIRMED', '2025-07-09 14:00:00'),
(19, 5, 1, 100.00, 'CONFIRMED', '2024-12-30 10:00:00'),
(20, 5, 4, 160.00, 'CONFIRMED', '2025-11-08 15:00:00');

-- Insert Payments for existing orders
INSERT INTO payments (id, user_id, order_id, amount, status, payment_method, transaction_id, payment_date) VALUES
(1, 1, 1, 75.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_001', '2024-12-28 10:05:00'),
(2, 1, 2, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_002', '2025-12-10 14:05:00'),
(3, 1, 3, 32.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_003', '2025-12-15 16:05:00'),
(4, 1, 4, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_004', '2025-10-25 12:05:00'),
(5, 1, 5, 120.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_005', '2025-08-10 11:05:00'),
(6, 1, 6, 105.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_006', '2025-05-15 10:05:00'),
(7, 2, 7, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_007', '2024-12-29 09:05:00'),
(8, 2, 8, 40.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_008', '2025-12-18 15:05:00'),
(9, 2, 9, 230.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_009', '2025-11-05 10:05:00'),
(10, 2, 10, 40.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_010', '2025-09-15 13:05:00'),
(11, 2, 11, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_011', '2025-07-08 11:05:00'),
(12, 3, 12, 120.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_012', '2025-12-12 11:05:00'),
(13, 3, 13, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_013', '2025-10-28 14:05:00'),
(14, 3, 14, 120.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_014', '2025-11-28 16:05:00'),
(15, 3, 15, 70.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_015', '2025-05-18 12:05:00'),
(16, 4, 16, 240.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_016', '2025-08-12 10:05:00'),
(17, 4, 17, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_017', '2025-09-18 12:05:00'),
(18, 4, 18, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_018', '2025-07-09 14:05:00'),
(19, 5, 19, 100.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_019', '2024-12-30 10:05:00'),
(20, 5, 20, 160.00, 'COMPLETED', 'CREDIT_CARD', 'pi_test_020', '2025-11-08 15:05:00');

-- Order Items
INSERT INTO order_items (id, order_id, ticket_type_id, quantity, price_per_ticket, is_valid) VALUES
(1, 1, 1, 2, 25.00, TRUE),
(2, 1, 2, 1, 50.00, TRUE),
(3, 2, 3, 3, 30.00, TRUE),
(4, 3, 5, 1, 20.00, TRUE),
(5, 3, 6, 1, 12.00, TRUE),
(6, 4, 9, 3, 15.00, TRUE),
(7, 5, 11, 1, 120.00, TRUE),
(8, 6, 16, 2, 35.00, TRUE),
(9, 6, 17, 1, 70.00, TRUE),
(10, 7, 2, 1, 50.00, TRUE),
(11, 8, 5, 2, 20.00, TRUE),
(12, 9, 7, 1, 80.00, TRUE),
(13, 9, 8, 1, 150.00, TRUE),
(14, 10, 12, 1, 25.00, TRUE),
(15, 10, 13, 1, 15.00, TRUE),
(16, 11, 18, 2, 40.00, TRUE),
(17, 12, 4, 2, 60.00, TRUE),
(18, 13, 9, 2, 15.00, TRUE),
(19, 14, 14, 4, 30.00, TRUE),
(20, 15, 16, 2, 35.00, TRUE),
(21, 16, 11, 2, 120.00, TRUE),
(22, 17, 12, 2, 25.00, TRUE),
(23, 18, 18, 2, 40.00, TRUE),
(24, 19, 2, 2, 50.00, TRUE),
(25, 20, 7, 2, 80.00, TRUE);

-- Insert Reviews
INSERT INTO reviews (id, user_id, event_id, rating, comment, created_at, updated_at) VALUES
(1, 1, 1, 5, 'Amazing concert! The energy was incredible!', '2025-01-02 10:00:00', '2025-01-02 10:00:00'),
(2, 1, 2, 4, 'Great jazz performances, really enjoyed it.', '2025-12-16 14:00:00', '2025-12-16 14:00:00'),
(3, 1, 5, 5, 'Epic Halloween party! Perfect atmosphere!', '2025-11-01 12:00:00', '2025-11-01 12:00:00'),
(4, 2, 1, 5, 'Best New Year celebration ever!', '2025-01-02 11:00:00', '2025-01-02 11:00:00'),
(5, 2, 3, 4, 'Wonderful play, great for the whole family.', '2025-12-21 10:00:00', '2025-12-21 10:00:00'),
(6, 3, 5, 5, 'Had a blast at the Halloween party!', '2025-11-01 13:00:00', '2025-11-01 13:00:00'),
(7, 3, 8, 4, 'Great match, amazing atmosphere!', '2025-12-02 10:00:00', '2025-12-02 10:00:00');

-- Reset auto-increment counters
ALTER TABLE roles AUTO_INCREMENT = 4;
ALTER TABLE categories AUTO_INCREMENT = 6;
ALTER TABLE venues AUTO_INCREMENT = 9;
ALTER TABLE users AUTO_INCREMENT = 19;
ALTER TABLE events AUTO_INCREMENT = 23;
ALTER TABLE ticket_types AUTO_INCREMENT = 41;
ALTER TABLE orders AUTO_INCREMENT = 21;
ALTER TABLE payments AUTO_INCREMENT = 21;
ALTER TABLE order_items AUTO_INCREMENT = 26;
ALTER TABLE reviews AUTO_INCREMENT = 8