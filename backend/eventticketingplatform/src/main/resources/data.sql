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

-- Insert Categories (Extended)
INSERT INTO categories (id, name, description) VALUES
(1, 'Bar', 'Live music, DJ sets and bar events'),
(2, 'Stadium', 'Sports events and large concerts'),
(3, 'Theater', 'Theater performances and cultural shows'),
(4, 'Conference', 'Business conferences and seminars'),
(5, 'Festival', 'Music festivals and outdoor events'),
(6, 'Comedy', 'Stand-up comedy and improv shows'),
(7, 'Classical', 'Classical music and opera'),
(8, 'Exhibition', 'Art exhibitions and gallery openings'),
(9, 'Workshop', 'Educational workshops and masterclasses'),
(10, 'Sports', 'Sports events and tournaments');

-- Insert Venues (Extended to 30)
INSERT INTO venues (id, name, address, city, capacity, latitude, longitude) VALUES
(1, 'YOU Concert Hall', 'Tsimiski 45', 'Thessaloniki', 1000, 40.6401, 22.9444),
(2, 'Kolokotronis Stadium', 'Leoforos Kifisias 120', 'Athens', 100000, 38.0653, 23.8106),
(3, 'The Pub', 'Koroneou 23', 'Heraklion', 100, 35.3387, 25.1442),
(4, 'Thessaloniki Theater', 'Aristotelous Square 12', 'Thessaloniki', 1000, 40.6334, 22.9419),
(5, 'Athens Music Arena', 'Syngrou Avenue 234', 'Athens', 5000, 37.9467, 23.7333),
(6, 'Patras Festival Grounds', 'Harbourfront', 'Patras', 10000, 38.2466, 21.7346),
(7, 'Mykonos Beach Club', 'Paradise Beach', 'Mykonos', 500, 37.4467, 25.3289),
(8, 'Rhodes Conference Center', 'Mandraki Port', 'Rhodes', 2000, 36.4511, 28.2278),
(9, 'Santorini Open Theater', 'Fira Caldera', 'Santorini', 800, 36.4138, 25.4318),
(10, 'Crete Exhibition Center', 'Heraklion Port', 'Heraklion', 3000, 35.3387, 25.1332),
(11, 'Kavala Music Hall', 'Eleftherias Square', 'Kavala', 600, 40.9363, 24.4027),
(12, 'Volos Sports Arena', 'Dimokratias Avenue', 'Volos', 8000, 39.3617, 22.9444),
(13, 'Ioannina Cultural Center', 'Lake Pamvotida', 'Ioannina', 1200, 39.665, 20.8537),
(14, 'Corfu Grand Theater', 'Spianada Square', 'Corfu', 900, 39.6242, 19.9217),
(15, 'Larissa Stadium', 'Alcazar Park', 'Larissa', 16000, 39.639, 22.4191),
(16, 'Chania Music Venue', 'Old Venetian Harbor', 'Chania', 400, 35.5138, 24.018),
(17, 'Kalamata Arts Center', 'Navarinou Street', 'Kalamata', 700, 37.0385, 22.1141),
(18, 'Zakynthos Beach Arena', 'Laganas Beach', 'Zakynthos', 2000, 37.751, 20.8844),
(19, 'Kos Conference Hall', 'Hippocrates Square', 'Kos', 1500, 36.8933, 27.2881),
(20, 'Drama Theater', 'Venizelou Street', 'Drama', 500, 41.1533, 24.1453),
(21, 'Tripoli Concert Hall', 'Areos Square', 'Tripoli', 800, 37.5089, 22.3797),
(22, 'Agrinio Sports Complex', 'Stadium Avenue', 'Agrinio', 5000, 38.6211, 21.4078),
(23, 'Kozani Cultural Center', 'Nikaias Square', 'Kozani', 600, 40.3008, 21.7889),
(24, 'Alexandroupoli Beach Club', 'Lighthouse Beach', 'Alexandroupoli', 300, 40.8467, 25.8764),
(25, 'Serres Exhibition Hall', 'Freedom Square', 'Serres', 1000, 41.0856, 23.5486),
(26, 'Xanthi Music Lounge', 'Old Town', 'Xanthi', 250, 41.135, 24.8881),
(27, 'Trikala Tech Hub', 'Mill of Elves', 'Trikala', 400, 39.5556, 21.7681),
(28, 'Veria Theater', 'Metropolis Street', 'Veria', 650, 40.5214, 22.2014),
(29, 'Preveza Marina Club', 'Pantokratoros Beach', 'Preveza', 450, 38.9594, 20.7514),
(30, 'Florina Winter Arena', 'Sakoulevas Lake', 'Florina', 1200, 40.7826, 21.4089);


-- Insert Users (50 total: 30 regular, 15 organizers, 5 admins)
-- Password for all: "password123"
-- Hash: $2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u

-- Regular Users (1-30)
INSERT INTO users (id, name, email, password, phone_number, is_active, created_at) VALUES
(1, 'Georgios Papadopoulos', 'george.p@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345601', true, '2024-01-15 10:00:00'),
(2, 'Maria Konstantinou', 'maria.k@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345602', true, '2024-02-20 11:00:00'),
(3, 'Dimitris Nikolaidis', 'dimitris.n@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345603', true, '2024-03-10 09:00:00'),
(4, 'Eleni Athanasiou', 'eleni.a@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345604', true, '2024-03-25 14:00:00'),
(5, 'Nikos Georgiou', 'nikos.g@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345605', true, '2024-04-05 12:00:00'),
(6, 'Sofia Ioannou', 'sofia.i@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345606', true, '2024-04-18 15:00:00'),
(7, 'Kostas Petridis', 'kostas.p@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345607', true, '2024-05-02 10:00:00'),
(8, 'Anna Dimitriou', 'anna.d@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345608', true, '2024-05-20 11:00:00'),
(9, 'Vasilis Karagiannis', 'vasilis.k@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345609', true, '2024-06-08 13:00:00'),
(10, 'Christina Michailidou', 'christina.m@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345610', true, '2024-06-22 16:00:00'),
(11, 'Alexandros Vasileiou', 'alex.v@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345611', true, '2024-07-10 09:00:00'),
(12, 'Katerina Papadaki', 'katerina.p@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345612', true, '2024-07-25 14:00:00'),
(13, 'Panagiotis Stavrou', 'panos.s@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345613', true, '2024-08-05 10:00:00'),
(14, 'Ioanna Maragou', 'ioanna.m@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345614', true, '2024-08-18 11:00:00'),
(15, 'Christos Antoniou', 'christos.a@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345615', true, '2024-09-01 12:00:00'),
(16, 'Despina Kyriakou', 'despina.k@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345616', true, '2024-09-15 13:00:00'),
(17, 'Giannis Christodoulou', 'giannis.c@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345617', true, '2024-10-01 10:00:00'),
(18, 'Fotini Oikonomou', 'fotini.o@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345618', true, '2024-10-12 14:00:00'),
(19, 'Michalis Theodorou', 'michalis.t@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345619', true, '2024-10-28 11:00:00'),
(20, 'Angeliki Savva', 'angeliki.s@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345620', true, '2024-11-05 15:00:00'),
(21, 'Stelios Makris', 'stelios.m@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345621', true, '2024-11-18 09:00:00'),
(22, 'Theodora Lambrinou', 'theodora.l@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345622', true, '2024-11-25 10:00:00'),
(23, 'Andreas Filippou', 'andreas.f@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345623', true, '2024-12-02 13:00:00'),
(24, 'Stamatia Rizou', 'stamatia.r@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345624', true, '2024-12-10 12:00:00'),
(25, 'Petros Vlachos', 'petros.v@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345625', true, '2024-12-15 14:00:00'),
(26, 'Athina Sotiropoulou', 'athina.s@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345626', true, '2024-12-20 11:00:00'),
(27, 'Spyros Manolis', 'spyros.m@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345627', true, '2025-01-05 10:00:00'),
(28, 'Vasiliki Koutsouki', 'vasiliki.k@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345628', true, '2025-01-10 15:00:00'),
(29, 'Konstantinos Alexiou', 'konstantinos.a@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345629', true, '2025-01-12 09:00:00'),
(30, 'Paraskevi Pappa', 'paraskevi.p@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6912345630', true, '2025-01-15 13:00:00');

-- Organizers (31-45)
INSERT INTO users (id, name, email, password, phone_number, is_active, created_at) VALUES
(31, 'Live Events Greece', 'organizer1@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345601', true, '2024-01-10 10:00:00'),
(32, 'Athens Cultural Productions', 'organizer2@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345602', true, '2024-01-15 11:00:00'),
(33, 'Thessaloniki Music Agency', 'organizer3@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345603', true, '2024-02-01 09:00:00'),
(34, 'Greek Sports Management', 'organizer4@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345604', true, '2024-02-10 10:00:00'),
(35, 'Island Festivals Co', 'organizer5@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345605', true, '2024-03-05 12:00:00'),
(36, 'Comedy Night Productions', 'organizer6@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345606', true, '2024-03-20 14:00:00'),
(37, 'Classical Arts Greece', 'organizer7@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345607', true, '2024-04-10 11:00:00'),
(38, 'Tech Conference Organizers', 'organizer8@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345608', true, '2024-04-25 13:00:00'),
(39, 'Beach Party Planners', 'organizer9@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345609', true, '2024-05-15 10:00:00'),
(40, 'Art Gallery Events', 'organizer10@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345610', true, '2024-06-01 15:00:00'),
(41, 'Greek Theater Company', 'organizer11@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345611', true, '2024-07-10 09:00:00'),
(42, 'DJ Collective Athens', 'organizer12@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345612', true, '2024-08-05 12:00:00'),
(43, 'Workshop Greece', 'organizer13@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345613', true, '2024-09-10 10:00:00'),
(44, 'Festival Productions Ltd', 'organizer14@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345614', true, '2024-10-15 14:00:00'),
(45, 'Concert Hall Management', 'organizer15@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6922345615', true, '2024-11-01 11:00:00');

-- Admins (46-50)
INSERT INTO users (id, name, email, password, phone_number, is_active, created_at) VALUES
(46, 'Admin Georgios', 'admin1@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6932345601', true, '2024-01-01 08:00:00'),
(47, 'Admin Maria', 'admin2@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6932345602', true, '2024-01-01 08:00:00'),
(48, 'Admin Nikos', 'admin3@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6932345603', true, '2024-01-01 08:00:00'),
(49, 'Admin Sofia', 'admin4@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6932345604', true, '2024-01-01 08:00:00'),
(50, 'Admin Dimitris', 'admin5@eventspot.com', '$2a$10$1WRAYx3kqrg/66AYU0Zhr.qs9lNNxfw/k/e47kfpRPyRpRLSlts9u', '6932345605', true, '2024-01-01 08:00:00');

-- Assign Roles
INSERT INTO users_roles (user_id, role_id) VALUES
-- Regular users (1-30)
(1, 1), (2, 1), (3, 1), (4, 1), (5, 1), (6, 1), (7, 1), (8, 1), (9, 1), (10, 1),
(11, 1), (12, 1), (13, 1), (14, 1), (15, 1), (16, 1), (17, 1), (18, 1), (19, 1), (20, 1),
(21, 1), (22, 1), (23, 1), (24, 1), (25, 1), (26, 1), (27, 1), (28, 1), (29, 1), (30, 1),
-- Organizers (31-45)
(31, 2), (32, 2), (33, 2), (34, 2), (35, 2), (36, 2), (37, 2), (38, 2), (39, 2), (40, 2),
(41, 2), (42, 2), (43, 2), (44, 2), (45, 2),
-- Admins (46-50)
(46, 3), (47, 3), (48, 3), (49, 3), (50, 3);

-- ========================================
-- PAST EVENTS (50 events - IDs 1-50)
-- ========================================

INSERT INTO events (id, title, description, event_date, event_time, category_id, venue_id, organizer_id, status, image_url, created_at) VALUES
-- January 2025 (Past)
(1, 'New Year Rock Concert 2025', 'Epic rock concert to celebrate the new year with top Greek bands', '2025-01-01', '22:00:00', 1, 1, 31, 'APPROVED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', '2024-11-01 10:00:00'),
(2, 'Classical New Year Gala', 'Elegant classical music performance featuring Athens Symphony Orchestra', '2025-01-01', '20:00:00', 7, 5, 37, 'APPROVED', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800', '2024-11-05 11:00:00'),
(3, 'Winter Art Exhibition Opening', 'Contemporary art exhibition showcasing emerging Greek artists', '2025-01-05', '18:00:00', 8, 10, 40, 'APPROVED', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', '2024-11-10 12:00:00'),
(4, 'Tech Talks 2025 - AI Future', 'Conference on artificial intelligence and machine learning advancements', '2025-01-10', '09:00:00', 4, 8, 38, 'APPROVED', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', '2024-11-15 10:00:00'),
(5, 'Stand-Up Comedy Night', 'Greek comedy legends perform their best routines', '2025-01-12', '21:00:00', 6, 4, 36, 'APPROVED', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800', '2024-11-20 14:00:00'),

-- February-March 2025
(6, 'Valentine Electronic Party', 'Valentine special with romantic electronic beats', '2025-02-14', '23:00:00', 1, 3, 42, 'APPROVED', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', '2024-12-01 10:00:00'),
(7, 'Greek Independence Day Concert', 'Patriotic concert celebrating Greek Independence', '2025-03-25', '20:00:00', 7, 1, 45, 'APPROVED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', '2025-01-10 11:00:00'),
(8, 'Spring Theater Festival', 'Week-long theater festival featuring modern Greek plays', '2025-03-20', '19:00:00', 3, 4, 41, 'APPROVED', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', '2025-01-15 12:00:00'),
(9, 'Basketball Championship Finals', 'Panathinaikos vs Olympiacos - Championship deciding game', '2025-03-15', '20:00:00', 10, 2, 34, 'APPROVED', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', '2025-01-20 13:00:00'),
(10, 'Photography Workshop Masterclass', 'Professional photography techniques with award-winning photographers', '2025-03-10', '10:00:00', 9, 10, 43, 'APPROVED', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800', '2025-02-01 10:00:00'),

-- April 2025
(11, 'Easter Jazz Festival', 'Three-day jazz festival with international artists', '2025-04-18', '19:00:00', 1, 5, 31, 'APPROVED', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', '2025-02-10 11:00:00'),
(12, 'Greek Wine Tasting Evening', 'Sommelier-led wine tasting featuring premium Greek wines', '2025-04-22', '18:00:00', 9, 16, 43, 'APPROVED', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', '2025-02-15 12:00:00'),
(13, 'Opera Night - La Traviata', 'Classic Verdi opera performed by Greek National Opera', '2025-04-25', '20:00:00', 7, 5, 37, 'APPROVED', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', '2025-03-01 13:00:00'),
(14, 'Tech Startup Pitch Night', 'Emerging tech startups pitch to investors', '2025-04-28', '18:00:00', 4, 27, 38, 'APPROVED', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', '2025-03-10 10:00:00'),
(15, 'Electronic Music Marathon', '12-hour electronic music marathon with 15 DJs', '2025-04-30', '18:00:00', 5, 7, 35, 'APPROVED', 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800', '2025-03-15 14:00:00'),

-- May 2025
(16, 'May Day Rock Festival', 'Outdoor rock festival celebrating workers day', '2025-05-01', '16:00:00', 5, 6, 44, 'APPROVED', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', '2025-03-20 11:00:00'),
(17, 'Contemporary Dance Performance', 'Modern dance troupe performs original choreography', '2025-05-05', '20:30:00', 3, 9, 41, 'APPROVED', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800', '2025-03-25 12:00:00'),
(18, 'Greek Film Festival', 'Week-long showcase of award-winning Greek cinema', '2025-05-10', '19:00:00', 3, 14, 32, 'APPROVED', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', '2025-04-01 10:00:00'),
(19, 'Digital Marketing Summit', 'Two-day conference on digital marketing strategies', '2025-05-15', '09:00:00', 4, 19, 38, 'APPROVED', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', '2025-04-05 13:00:00'),
(20, 'Beach Volleyball Tournament', 'Professional beach volleyball championship', '2025-05-20', '10:00:00', 10, 18, 34, 'APPROVED', 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800', '2025-04-10 11:00:00'),

-- June 2025
(21, 'Summer Solstice Music Fest', 'Celebrate longest day with 24-hour music festival', '2025-06-21', '12:00:00', 5, 6, 44, 'APPROVED', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', '2025-04-20 10:00:00'),
(22, 'Aegean Comedy Tour', 'Stand-up comedy tour across Greek islands', '2025-06-15', '21:00:00', 6, 11, 36, 'APPROVED', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', '2025-04-25 12:00:00'),
(23, 'Ancient Greek Theater - Medea', 'Outdoor performance of Euripides classic', '2025-06-10', '21:00:00', 3, 9, 41, 'APPROVED', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', '2025-05-01 14:00:00'),
(24, 'Cooking Masterclass - Greek Cuisine', 'Learn authentic Greek recipes from master chefs', '2025-06-05', '11:00:00', 9, 17, 43, 'APPROVED', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', '2025-05-05 10:00:00'),
(25, 'Underwater Photography Exhibition', 'Stunning underwater photos from Greek seas', '2025-06-08', '18:00:00', 8, 25, 40, 'APPROVED', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', '2025-05-10 11:00:00'),

-- July 2025
(26, 'Mykonos Full Moon Party', 'Epic beach party under the full moon', '2025-07-10', '22:00:00', 5, 7, 39, 'APPROVED', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', '2025-05-15 13:00:00'),
(27, 'Classical Guitar Recital', 'Virtuoso classical guitarist performs Spanish pieces', '2025-07-15', '20:00:00', 7, 11, 37, 'APPROVED', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800', '2025-05-20 10:00:00'),
(28, 'Santorini Sunset Concert', 'Classical music at sunset overlooking caldera', '2025-07-20', '19:30:00', 7, 9, 45, 'APPROVED', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', '2025-05-25 12:00:00'),
(29, 'Greek Hip Hop Festival', 'Biggest Greek hip hop festival of the year', '2025-07-25', '20:00:00', 1, 5, 31, 'APPROVED', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '2025-06-01 14:00:00'),
(30, 'Sailing Regatta Championship', 'International sailing competition in Aegean Sea', '2025-07-28', '08:00:00', 10, 29, 34, 'APPROVED', 'https://images.unsplash.com/photo-1535036043573-7c0d16d3bb15?w=800', '2025-06-05 10:00:00'),

-- August 2025
(31, 'Athens Street Food Festival', 'Celebrate Greek street food culture', '2025-08-01', '18:00:00', 5, 2, 44, 'APPROVED', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', '2025-06-10 11:00:00'),
(32, 'Electronic Beach Festival Crete', 'Three-day electronic music festival on the beach', '2025-08-10', '17:00:00', 5, 10, 35, 'APPROVED', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', '2025-06-15 12:00:00'),
(33, 'Greek Folk Music Night', 'Traditional Greek folk songs and dances', '2025-08-15', '21:00:00', 1, 13, 33, 'APPROVED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', '2025-06-20 13:00:00'),
(34, 'Outdoor Cinema Under Stars', 'Classic Greek films screened under the stars', '2025-08-20', '21:30:00', 3, 9, 32, 'APPROVED', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', '2025-07-01 10:00:00'),
(35, 'Photography Workshop - Landscape', 'Master landscape photography in Greek mountains', '2025-08-25', '07:00:00', 9, 30, 43, 'APPROVED', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800', '2025-07-05 11:00:00'),

-- September 2025
(36, 'Thessaloniki Film Festival', 'International film festival showcasing world cinema', '2025-09-05', '18:00:00', 3, 4, 32, 'APPROVED', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', '2025-07-10 12:00:00'),
(37, 'Grape Harvest Festival', 'Traditional wine harvest celebration with music', '2025-09-15', '12:00:00', 5, 6, 44, 'APPROVED', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', '2025-07-15 10:00:00'),
(38, 'Modern Art Symposium', 'Contemporary artists discuss current trends', '2025-09-20', '10:00:00', 8, 25, 40, 'APPROVED', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', '2025-07-20 13:00:00'),
(39, 'Rembetika Music Revival', 'Traditional rembetika music with authentic instruments', '2025-09-25', '21:00:00', 1, 1, 31, 'APPROVED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', '2025-08-01 11:00:00'),
(40, 'Marathon Running Competition', 'Historic Athens Marathon route race', '2025-09-28', '07:00:00', 10, 2, 34, 'APPROVED', 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800', '2025-08-05 10:00:00'),

-- October-December 2025
(41, 'Halloween Horror Theater', 'Scary theater performances for Halloween', '2025-10-31', '20:00:00', 3, 20, 41, 'APPROVED', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800', '2025-09-01 12:00:00'),
(42, 'Thessaloniki Jazz Festival', 'International jazz festival with world-class performers', '2025-11-10', '20:00:00', 1, 1, 31, 'APPROVED', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', '2025-09-10 11:00:00'),
(43, 'Greek Startup Conference', 'Entrepreneurship conference for Greek startups', '2025-11-20', '09:00:00', 4, 8, 38, 'APPROVED', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', '2025-09-20 13:00:00'),
(44, 'Winter Lights Festival', 'Spectacular light installations across the city', '2025-12-01', '18:00:00', 8, 4, 40, 'APPROVED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', '2025-10-01 10:00:00'),
(45, 'Christmas Market Opening', 'Traditional Christmas market with crafts and food', '2025-12-05', '16:00:00', 5, 1, 44, 'APPROVED', 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800', '2025-10-10 11:00:00'),
(46, 'New Year Eve Gala Concert', 'Grand orchestra performance for New Year celebration', '2025-12-31', '22:00:00', 7, 5, 37, 'APPROVED', 'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800', '2025-11-01 12:00:00'),
(47, 'Christmas Comedy Special', 'Holiday-themed comedy show with top Greek comedians', '2025-12-20', '21:00:00', 6, 4, 36, 'APPROVED', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', '2025-11-10 10:00:00'),
(48, 'Winter Sports Gala', 'Celebration of Greek winter sports achievements', '2025-12-15', '19:00:00', 10, 30, 34, 'APPROVED', 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=800', '2025-11-15 13:00:00'),
(49, 'Chamber Music Evening', 'Intimate classical chamber music performance', '2025-12-10', '20:00:00', 7, 21, 37, 'APPROVED', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800', '2025-11-20 11:00:00'),
(50, 'Greek Theater Retrospective', 'Celebrating 100 years of Greek theater', '2025-12-18', '19:00:00', 3, 4, 41, 'APPROVED', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', '2025-11-25 12:00:00');

-- ========================================
-- UPCOMING EVENTS (50 events - IDs 51-100)
-- ========================================

INSERT INTO events (id, title, description, event_date, event_time, category_id, venue_id, organizer_id, status, image_url, created_at) VALUES
-- January 2026 (Added)
(51, 'New Year Warm-Up DJ Night', 'Post-holiday electronic night to start the year strong', '2026-01-23', '22:00:00', 1, 3, 42, 'APPROVED', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', '2025-12-01 10:00:00'),
(52, 'Winter Jazz Marathon', 'Non-stop jazz performances by international artists', '2026-01-24', '18:00:00', 1, 5, 31, 'APPROVED', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', '2025-12-05 11:00:00'),
(53, 'Contemporary Art Opening', 'New contemporary art exhibition opening night', '2026-01-26', '19:00:00', 8, 10, 40, 'APPROVED', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', '2025-12-10 12:00:00'),
(54, 'Tech Innovation Summit (Winter Edition)', 'Latest in AI, blockchain, and emerging technologies', '2026-01-28', '09:00:00', 4, 8, 38, 'APPROVED', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', '2025-12-15 13:00:00'),
(55, 'Stand-Up Comedy Showcase', 'Rising Greek comedians perform new material', '2026-01-30', '21:00:00', 6, 4, 36, 'APPROVED', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800', '2025-12-20 10:00:00'),

-- February 2026
(56, 'Valentine DJ Night 2026', 'Romantic electronic music evening for couples', '2026-02-14', '22:00:00', 1, 3, 42, 'APPROVED', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', '2026-01-05 11:00:00'),
(57, 'Winter Jazz Showcase', 'Curated jazz performances by international artists', '2026-02-20', '18:00:00', 1, 5, 31, 'APPROVED', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', '2026-01-06 12:00:00'),
(58, 'Contemporary Art Weekend', 'A weekend of contemporary art and talks', '2026-02-25', '19:00:00', 8, 10, 40, 'APPROVED', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', '2026-01-07 10:00:00'),
(59, 'Tech Innovation Summit 2026', 'Latest in AI, blockchain, and emerging technologies', '2026-02-28', '09:00:00', 4, 8, 38, 'APPROVED', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', '2026-01-08 13:00:00'),
(60, 'Comedy Winter Special', 'A winter special with rising Greek comedians', '2026-02-22', '21:00:00', 6, 4, 36, 'APPROVED', 'https://images.unsplash.com/photo-1585699324551-f6c309eedeca?w=800', '2026-01-09 11:00:00'),

-- March 2026
(61, 'Greek Independence Concert 2026', 'National celebration concert with traditional music', '2026-03-25', '20:00:00', 7, 1, 45, 'APPROVED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', '2026-01-10 11:00:00'),
(62, 'Spring Theater Premiere', 'New Greek play premieres at national theater', '2026-03-15', '19:30:00', 3, 4, 41, 'APPROVED', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', '2026-01-11 12:00:00'),
(63, 'Basketball Playoff Game', 'Critical playoff matchup between Athens rivals', '2026-03-20', '20:00:00', 10, 2, 34, 'APPROVED', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', '2026-01-12 13:00:00'),
(64, 'Digital Photography Workshop', 'Advanced digital photography techniques masterclass', '2026-03-10', '10:00:00', 9, 10, 43, 'APPROVED', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800', '2026-01-13 10:00:00'),
(65, 'Electronic Music Night', 'Progressive house and techno DJ showcase', '2026-03-28', '23:00:00', 1, 3, 42, 'APPROVED', 'https://images.unsplash.com/photo-1571330735066-03aaa9429d89?w=800', '2026-01-14 11:00:00'),

-- April 2026
(66, 'Easter Folk Music Festival', 'Traditional Greek Easter celebration with live music', '2026-04-10', '18:00:00', 1, 13, 33, 'APPROVED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', '2026-01-15 10:00:00'),
(67, 'Wine & Food Pairing Event', 'Gourmet experience with Greek wines and cuisine', '2026-04-15', '19:00:00', 9, 16, 43, 'APPROVED', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', '2026-01-16 12:00:00'),
(68, 'Opera - Carmen', 'Bizet opera performed by national opera company', '2026-04-20', '20:00:00', 7, 5, 37, 'APPROVED', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', '2026-01-17 11:00:00'),
(69, 'Startup Investor Meetup', 'Connect startups with venture capital investors', '2026-04-25', '17:00:00', 4, 27, 38, 'APPROVED', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', '2026-01-18 13:00:00'),
(70, 'Beach Opening Party', 'Season opening beach party with international DJs', '2026-04-30', '20:00:00', 5, 7, 39, 'APPROVED', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', '2026-01-19 10:00:00'),

-- May 2026
(71, 'May Day Rock Fest 2026', 'Outdoor rock concert celebrating workers solidarity', '2026-05-01', '16:00:00', 5, 6, 44, 'APPROVED', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', '2026-01-20 11:00:00'),
(72, 'Modern Dance Showcase', 'Contemporary dance companies perform latest works', '2026-05-10', '20:30:00', 3, 9, 41, 'APPROVED', 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800', '2026-01-20 12:00:00'),
(73, 'Greek Cinema Week', 'Showcase of recent award-winning Greek films', '2026-05-15', '19:00:00', 3, 14, 32, 'APPROVED', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', '2026-01-20 10:00:00'),
(74, 'Social Media Marketing Conference', 'Latest trends in social media marketing', '2026-05-20', '09:00:00', 4, 19, 38, 'APPROVED', 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800', '2026-01-20 13:00:00'),
(75, 'Beach Sports Championship', 'Beach volleyball and football tournament', '2026-05-25', '10:00:00', 10, 18, 34, 'APPROVED', 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800', '2026-01-20 11:00:00'),

-- June 2026
(76, 'Midsummer Music Festival', 'Celebrate summer solstice with live music', '2026-06-21', '12:00:00', 5, 6, 44, 'APPROVED', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', '2026-01-20 14:00:00'),
(77, 'Comedy Club Summer Tour', 'Top Greek comedians tour island venues', '2026-06-15', '21:00:00', 6, 11, 36, 'APPROVED', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', '2026-01-20 15:00:00'),
(78, 'Ancient Greek Drama - Oedipus', 'Classic Sophocles tragedy under the stars', '2026-06-20', '21:00:00', 3, 9, 41, 'APPROVED', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', '2026-01-20 16:00:00'),
(79, 'Mediterranean Cooking Class', 'Learn secrets of Mediterranean cuisine', '2026-06-10', '11:00:00', 9, 17, 43, 'APPROVED', 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800', '2026-01-20 17:00:00'),
(80, 'Marine Life Photography Exhibit', 'Underwater photography from Greek waters', '2026-06-05', '18:00:00', 8, 25, 40, 'APPROVED', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800', '2026-01-20 18:00:00'),

-- July 2026
(81, 'Mykonos Summer Festival 2026', 'Week-long beach festival with top DJs', '2026-07-15', '20:00:00', 5, 7, 39, 'APPROVED', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', '2026-01-20 19:00:00'),
(82, 'Classical Guitar Concert Series', 'Three evenings of classical guitar masterpieces', '2026-07-20', '20:00:00', 7, 11, 37, 'APPROVED', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800', '2026-01-20 20:00:00'),
(83, 'Santorini Jazz Sunset', 'Jazz at sunset with caldera views', '2026-07-25', '19:30:00', 1, 9, 31, 'APPROVED', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800', '2026-01-20 21:00:00'),
(84, 'Greek Hip Hop Summit', 'Hip hop conference and performances', '2026-07-28', '18:00:00', 1, 5, 31, 'APPROVED', 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800', '2026-01-20 21:30:00'),
(85, 'Aegean Sailing Championship', 'International yacht racing competition', '2026-07-30', '08:00:00', 10, 29, 34, 'APPROVED', 'https://images.unsplash.com/photo-1535036043573-7c0d16d3bb15?w=800', '2026-01-20 22:00:00'),

-- August 2026
(86, 'Greek Street Food Carnival', 'Celebrate traditional Greek street food', '2026-08-05', '17:00:00', 5, 2, 44, 'APPROVED', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', '2026-01-20 22:15:00'),
(87, 'Electronic Beach Festival 2026', 'Three-day electronic music beach festival', '2026-08-15', '17:00:00', 5, 10, 35, 'APPROVED', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800', '2026-01-20 22:30:00'),
(88, 'Traditional Folk Dance Festival', 'Greek regional dances and costumes showcase', '2026-08-20', '20:00:00', 1, 13, 33, 'APPROVED', 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?w=800', '2026-01-20 22:45:00'),
(89, 'Summer Cinema Nights', 'Classic international films under stars', '2026-08-25', '21:00:00', 3, 9, 32, 'APPROVED', 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800', '2026-01-20 23:00:00'),
(90, 'Mountain Photography Expedition', 'Capture Greek mountain landscapes', '2026-08-28', '06:00:00', 9, 30, 43, 'APPROVED', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800', '2026-01-20 23:15:00'),

-- September-December 2026
(91, 'Thessaloniki International Film Fest', 'Major international film festival', '2026-09-10', '17:00:00', 3, 4, 32, 'APPROVED', 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800', '2026-01-21 09:00:00'),
(92, 'Autumn Wine Festival', 'New wine season celebration', '2026-09-20', '12:00:00', 5, 6, 44, 'APPROVED', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', '2026-01-21 09:15:00'),
(93, 'Contemporary Art Biennale', 'International contemporary art exhibition', '2026-09-25', '11:00:00', 8, 25, 40, 'APPROVED', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', '2026-01-21 09:30:00'),
(94, 'Rembetika Night Marathon', 'All-night traditional rembetika music', '2026-09-28', '21:00:00', 1, 1, 31, 'APPROVED', 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800', '2026-01-21 09:45:00'),
(95, 'Athens Classic Marathon 2026', 'Historic Athens to Marathon route race', '2026-10-11', '08:00:00', 10, 2, 34, 'APPROVED', 'https://images.unsplash.com/photo-1502904550040-7534597429ae?w=800', '2026-01-21 10:00:00'),
(96, 'Halloween Haunted Theater', 'Spooky theatrical performances', '2026-10-30', '20:00:00', 3, 20, 41, 'APPROVED', 'https://images.unsplash.com/photo-1509248961158-e54f6934749c?w=800', '2026-01-21 10:15:00'),
(97, 'Jazz Autumn Festival', 'International jazz artists perform', '2026-11-15', '20:00:00', 1, 1, 31, 'APPROVED', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', '2026-01-21 10:30:00'),
(98, 'Entrepreneurship Summit 2026', 'Startup ecosystem conference', '2026-11-25', '09:00:00', 4, 8, 38, 'APPROVED', 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800', '2026-01-21 10:45:00'),
(99, 'Winter Illumination Festival', 'City-wide light art installations', '2026-12-05', '18:00:00', 8, 4, 40, 'APPROVED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', '2026-01-21 11:00:00'),
(100, 'Christmas Market 2026', 'Traditional crafts and holiday market', '2026-12-10', '15:00:00', 5, 1, 44, 'APPROVED', 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800', '2026-01-21 11:15:00'),
-- Additional 20 events (101-120)
(101, 'Rock Legends Reunion', 'Classic Greek rock bands reunion', '2026-03-15', '21:00:00', 1, 1, 31, 'APPROVED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', '2026-01-22 10:00:00'),
(102, 'Spring Food Festival', 'Greek gastronomy celebration', '2026-04-08', '12:00:00', 5, 6, 44, 'APPROVED', 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', '2026-01-22 10:15:00'),
(103, 'Tech Startup Expo', 'Greek startups exhibition', '2026-05-12', '10:00:00', 4, 8, 38, 'APPROVED', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', '2026-01-22 10:30:00'),
(104, 'Electro Night', 'Electronic music night', '2026-06-18', '23:00:00', 1, 3, 35, 'APPROVED', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', '2026-01-22 10:45:00'),
(105, 'Opera Gala', 'Greek opera performances', '2026-07-25', '20:00:00', 7, 5, 37, 'APPROVED', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', '2026-01-22 11:00:00'),
(106, 'Comedy Tour', 'Stand-up comedy', '2026-08-12', '21:00:00', 6, 11, 36, 'APPROVED', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', '2026-01-22 11:15:00'),
(107, 'Art Symposium', 'Modern art exhibition', '2026-09-08', '18:00:00', 8, 25, 40, 'APPROVED', 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800', '2026-01-22 11:30:00'),
(108, 'Football Derby', 'AEK vs PAOK', '2026-10-15', '20:00:00', 10, 2, 34, 'APPROVED', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800', '2026-01-22 11:45:00'),
(109, 'Wine Jazz', 'Jazz with wine tasting', '2026-11-20', '20:00:00', 1, 16, 31, 'APPROVED', 'https://images.unsplash.com/photo-1415201364774-f6f0bb35f28f?w=800', '2026-01-22 12:00:00'),
(110, 'Holiday Lights', 'Christmas lights festival', '2026-12-15', '18:00:00', 8, 4, 40, 'APPROVED', 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800', '2026-01-22 12:15:00'),
(111, 'Acoustic Night', 'Acoustic guitar performance', '2026-03-22', '21:00:00', 7, 21, 37, 'APPROVED', 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=800', '2026-01-22 12:30:00'),
(112, 'Beer Festival', 'Greek craft beers', '2026-05-18', '18:00:00', 5, 6, 44, 'APPROVED', 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?w=800', '2026-01-22 12:45:00'),
(113, 'Digital Arts', 'NFTs and AI creativity', '2026-06-22', '09:00:00', 4, 8, 38, 'APPROVED', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800', '2026-01-22 13:00:00'),
(114, 'Salsa Marathon', 'Latin dance night', '2026-07-30', '22:00:00', 1, 3, 42, 'APPROVED', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800', '2026-01-22 13:15:00'),
(115, 'Piano Recital', 'Classical piano concert', '2026-08-28', '20:00:00', 7, 4, 37, 'APPROVED', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800', '2026-01-22 13:30:00'),
(116, 'Improv Comedy', 'Interactive comedy', '2026-09-19', '21:00:00', 6, 20, 36, 'APPROVED', 'https://images.unsplash.com/photo-1527224857830-43a7acc85260?w=800', '2026-01-22 13:45:00'),
(117, 'Photo Workshop', 'Photography masterclass', '2026-10-25', '10:00:00', 9, 10, 43, 'APPROVED', 'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800', '2026-01-22 14:00:00'),
(118, 'Volleyball Finals', 'Championship finals', '2026-11-12', '19:00:00', 10, 12, 34, 'APPROVED', 'https://images.unsplash.com/photo-1547347298-4074fc3086f0?w=800', '2026-01-22 14:15:00'),
(119, 'New Year Gala', 'Grand concert', '2026-12-31', '22:00:00', 7, 5, 37, 'APPROVED', 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=800', '2026-01-22 14:30:00'),
(120, 'Theater Festival', 'Contemporary theater', '2026-12-20', '19:00:00', 3, 4, 41, 'APPROVED', 'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800', '2026-01-22 14:45:00');


-- ========================================
-- TICKET TYPES
-- ========================================

-- Ticket Types for PAST Events (1-50)
INSERT INTO ticket_types (id, event_id, name, price, total_quantity, quantity_available, description) VALUES
-- Event 1 - New Year Rock Concert
(1, 1, 'General Admission', 6.00, 120, 118, 'Standing area access with great sound quality'),
(2, 1, 'VIP', 6.00, 90, 86, 'VIP section with bar access and reserved seating'),
(3, 1, 'Early Bird', 18.00, 90, 90, 'Discounted early booking price'),

-- Event 2 - Classical New Year Gala
(4, 2, 'Orchestra Level', 2.50, 120, 116, 'Best seats with optimal acoustics'),
(5, 2, 'Balcony', 6.00, 90, 88, 'Elevated view of the stage'),
(6, 2, 'Student', 4.00, 90, 88, 'Valid student ID required'),

-- Event 3 - Winter Art Exhibition
(7, 3, 'Opening Night', 2.50, 120, 116, 'Special opening night access with artist meet'),
(8, 3, 'Regular Entry', 6.00, 250, 248, 'Standard exhibition entry'),

-- Event 4 - Tech Talks AI Future
(9, 4, 'Standard Pass', 2.50, 120, 116, 'Access to all sessions and lunch'),
(10, 4, 'Premium Pass', 38.00, 90, 89, 'VIP networking, workshops, and dinner'),
(11, 4, 'Student Pass', 6.00, 90, 90, 'Student discount - ID required'),

-- Event 5 - Stand-Up Comedy Night
(12, 5, 'General Seating', 2.50, 120, 115, 'Standard theater seating'),
(13, 5, 'Front Row', 18.00, 70, 69, 'Premium front row seats'),
(14, 5, 'Group (4+)', 18.00, 90, 90, 'Group of 4 tickets - save 12%'),

-- Event 6 - Valentine Electronic Party
(15, 6, 'Couples Entry', 6.00, 70, 67, 'Special couples pricing - 2 people'),
(16, 6, 'Single Entry', 4.00, 80, 79, 'Individual entry ticket'),

-- Event 7 - Greek Independence Concert
(17, 7, 'General Admission', 4.00, 120, 110, 'Standing room with excellent views'),
(18, 7, 'Reserved Seating', 6.00, 90, 88, 'Comfortable reserved seats'),
(19, 7, 'Family Pack (4)', 6.00, 70, 66, 'Family discount - 4 tickets'),

-- Event 8 - Spring Theater Festival
(20, 8, 'Festival Pass', 4.00, 90, 80, 'Access to all festival performances'),
(21, 8, 'Single Show', 6.00, 120, 120, 'Entry to one performance of choice'),

-- Event 9 - Basketball Championship
(22, 9, 'Lower Bowl', 2.50, 10000, 9991, 'Close to court seating'),
(23, 9, 'Upper Bowl', 2.50, 15000, 15000, 'Upper level seats with full view'),
(24, 9, 'Courtside VIP', 38.00, 120, 120, 'Premium courtside seats'),

-- Event 10 - Photography Workshop
(25, 10, 'Workshop Entry', 4.00, 50, 45, 'Includes materials and lunch'),
(26, 10, 'Observer Pass', 2.50, 30, 30, 'Watch and learn without hands-on'),

-- Events 11-20
(27, 11, 'Day Pass', 2.50, 250, 241, 'Single day festival access'),
(28, 11, '3-Day Pass', 6.00, 120, 120, 'Full festival access - save 25%'),
(29, 12, 'Tasting Session', 22.00, 70, 65, 'Includes 6 wines and appetizers'),
(30, 12, 'VIP Tasting', 2.50, 50, 50, 'Premium wines and sommelier guidance'),
(31, 13, 'Orchestra', 4.00, 90, 88, 'Best acoustics and view'),
(32, 13, 'Balcony', 18.00, 90, 90, 'Elevated view of stage'),
(33, 13, 'Student', 2.50, 70, 66, 'Student discount with valid ID'),
(34, 14, 'Attendee', 4.00, 90, 86, 'General conference access'),
(35, 14, 'Pitcher Package', 6.00, 50, 49, 'Includes pitch slot and networking'),
(36, 15, 'General Entry', 18.00, 120, 108, 'Beach party access'),
(37, 15, 'VIP Cabana', 4.00, 50, 50, 'Private cabana with bottle service'),
(38, 16, 'Day Ticket', 22.00, 250, 242, 'Single day festival entry'),
(39, 16, 'Weekend Pass', 2.50, 250, 250, 'Saturday and Sunday access'),
(40, 17, 'General Seating', 4.00, 120, 120, 'Standard theater seats'),
(41, 17, 'Premium', 6.00, 90, 90, 'Front section premium seats'),
(42, 18, 'Film Pass', 6.00, 90, 81, 'Access to all screenings'),
(43, 18, 'Single Screening', 6.00, 90, 86, 'One film of your choice'),
(44, 19, 'Conference Pass', 38.00, 120, 113, 'Both days with workshops'),
(45, 19, 'Single Day', 22.00, 90, 89, 'One day access'),
(46, 20, 'Tournament Entry', 6.00, 70, 65, 'Team registration fee'),
(47, 20, 'Spectator', 2.50, 120, 120, 'Watch the tournament'),

-- Events 21-30
(48, 21, '24-Hour Pass', 4.00, 250, 243, 'Full event access'),
(49, 21, 'Evening Only', 18.00, 250, 247, '6PM-midnight access'),
(50, 22, 'Show Ticket', 4.00, 90, 78, 'Comedy show entry'),
(51, 22, 'VIP Meet & Greet', 4.00, 70, 69, 'Show plus backstage meet'),
(52, 23, 'General Admission', 6.00, 120, 113, 'Outdoor theater seating'),
(53, 23, 'Premium Cushioned', 2.50, 90, 90, 'Comfortable premium seats'),
(54, 24, 'Masterclass', 2.50, 40, 35, 'Hands-on cooking class'),
(55, 24, 'Demonstration', 4.00, 80, 80, 'Watch and taste'),
(56, 25, 'Exhibition Entry', 4.00, 120, 114, 'Standard gallery access'),
(57, 25, 'Private Tour', 6.00, 50, 48, 'Guided tour with photographer'),
(58, 26, 'General Entry', 2.50, 120, 113, 'Beach party access'),
(59, 26, 'VIP Table', 38.00, 50, 49, 'Reserved table with bottle'),
(60, 27, 'Concert Ticket', 18.00, 90, 82, 'Classical guitar recital'),
(61, 27, 'Student', 2.50, 70, 70, 'Student discount available'),
(62, 28, 'Sunset Concert', 6.00, 120, 114, 'Amazing caldera views'),
(63, 28, 'Premium Seating', 2.50, 90, 89, 'Front row sunset views'),
(64, 29, 'Festival Pass', 2.50, 250, 238, 'Hip hop festival entry'),
(65, 29, 'VIP Access', 38.00, 90, 90, 'VIP area and meet artists'),
(66, 30, 'Crew Registration', 6.00, 50, 50, 'Sailing team entry fee'),
(67, 30, 'Spectator Boat', 4.00, 70, 65, 'Watch from boat'),

-- Events 31-40
(68, 31, 'Food Festival', 2.50, 250, 239, 'Taste all vendors'),
(69, 31, 'VIP Tasting', 6.00, 90, 86, 'Premium vendors and seating'),
(70, 32, 'Weekend Pass', 22.00, 120, 115, 'Three-day beach festival'),
(71, 32, 'Single Day', 2.50, 250, 249, 'One day access'),
(72, 33, 'Concert Entry', 6.00, 120, 107, 'Folk music concert'),
(73, 33, 'Family (4)', 2.50, 90, 90, 'Family discount package'),
(74, 34, 'Cinema Night', 6.00, 120, 108, 'Outdoor film screening'),
(75, 34, 'Double Feature', 2.50, 90, 90, 'Two films back-to-back'),
(76, 35, 'Workshop Full Day', 38.00, 30, 25, 'Equipment and guidance included'),
(77, 35, 'Half Day', 2.50, 20, 20, 'Morning session only'),
(78, 36, 'Festival Pass', 6.00, 120, 105, 'Full film festival access'),
(79, 36, 'Day Pass', 18.00, 120, 120, 'Single day screenings'),
(80, 37, 'Festival Entry', 4.00, 250, 241, 'Wine harvest celebration'),
(81, 37, 'Wine Tasting', 4.00, 90, 88, 'Premium wine tasting included'),
(82, 38, 'Symposium Pass', 2.50, 90, 85, 'Full symposium access'),
(83, 38, 'Single Session', 4.00, 90, 90, 'One session attendance'),
(84, 39, 'Concert Ticket', 28.00, 120, 111, 'Rembetika music concert'),
(85, 39, 'Front Row', 22.00, 70, 70, 'Close to stage seating'),
(86, 40, 'Marathon Entry', 2.50, 5000, 4995, 'Official marathon registration'),
(87, 40, 'Half Marathon', 6.00, 250, 249, 'Half marathon entry'),

-- Events 41-50
(88, 41, 'Horror Show', 22.00, 120, 108, 'Halloween theater performance'),
(89, 41, 'VIP Experience', 22.00, 70, 70, 'Backstage tour included'),
(90, 42, 'Jazz Festival', 28.00, 120, 108, 'Full festival access'),
(91, 42, 'Single Night', 4.00, 90, 90, 'One night performance'),
(92, 43, 'Conference Full', 4.00, 120, 116, 'Two-day conference pass'),
(93, 43, 'Startup Pitch', 6.00, 70, 68, 'Pitch and network'),
(94, 44, 'Exhibition Entry', 4.00, 250, 238, 'Light festival access'),
(95, 44, 'Guided Tour', 4.00, 90, 90, 'Expert guided tour'),
(96, 45, 'Market Entry', 2.50, 250, 230, 'Christmas market access'),
(97, 45, 'Workshop Pass', 6.00, 90, 89, 'Craft workshops included'),
(98, 46, 'Gala Ticket', 2.50, 250, 240, 'New Year Eve concert'),
(99, 46, 'VIP Champagne', 38.00, 90, 89, 'VIP with champagne'),
(100, 47, 'Comedy Show', 28.00, 120, 108, 'Christmas comedy special'),
(101, 47, 'Premium Seating', 22.00, 90, 90, 'Front section seats'),
(102, 48, 'Gala Entry', 6.00, 120, 110, 'Winter sports gala'),
(103, 48, 'VIP Reception', 6.00, 70, 69, 'VIP reception included'),
(104, 49, 'Concert Ticket', 18.00, 120, 115, 'Chamber music evening'),
(105, 49, 'Student', 2.50, 70, 70, 'Student discount rate'),
(106, 50, 'Performance', 4.00, 120, 105, 'Theater retrospective'),
(107, 50, 'All Access', 6.00, 70, 70, 'All shows and backstage');

-- Ticket Types for UPCOMING Events (51-100)
INSERT INTO ticket_types (id, event_id, name, price, total_quantity, quantity_available, description) VALUES
-- Events 51-60
(108, 51, 'Couples Entry', 4.00, 90, 90, 'Valentine special for two'),
(109, 51, 'Single', 18.00, 70, 68, 'Individual entry'),
(110, 52, 'Marathon Pass', 18.00, 120, 119, 'Full jazz marathon access'),
(111, 52, 'Evening Only', 18.00, 90, 90, 'Evening sessions only'),
(112, 53, 'Opening Night', 6.00, 120, 119, 'Special opening with artist'),
(113, 53, 'General Entry', 4.00, 120, 118, 'Standard gallery access'),
(114, 54, 'Conference Pass', 6.00, 250, 249, 'Full summit access'),
(115, 54, 'Workshop Only', 2.50, 90, 89, 'Workshop sessions'),
(116, 55, 'Show Ticket', 6.00, 120, 117, 'Comedy showcase entry'),
(117, 55, 'VIP Front Row', 6.00, 70, 70, 'Premium front seats'),

-- Events 61-70
(118, 56, 'Concert Entry', 18.00, 120, 120, 'Independence concert'),
(119, 56, 'Family Pack', 4.00, 90, 89, 'Family of 4 tickets'),
(120, 57, 'Theater Ticket', 4.00, 120, 119, 'Spring premiere'),
(121, 57, 'Premium', 28.00, 90, 89, 'Premium seating'),
(122, 58, 'Lower Bowl', 22.00, 12000, 11999, 'Close to action'),
(123, 58, 'Upper Bowl', 6.00, 18000, 17998, 'Upper level view'),
(124, 59, 'Workshop', 32.00, 40, 39, 'Photography masterclass'),
(125, 59, 'Observer', 22.00, 30, 29, 'Watch and learn'),
(126, 60, 'Party Entry', 2.50, 70, 68, 'Electronic music night'),
(127, 60, 'VIP Booth', 2.50, 20, 20, 'Private booth'),

-- Events 71-80
(128, 61, 'Festival Entry', 4.00, 250, 248, 'Easter folk festival'),
(129, 61, 'Premium', 6.00, 90, 89, 'Reserved seating'),
(130, 62, 'Wine Pairing', 4.00, 70, 69, 'Wine and food pairing'),
(131, 62, 'Premium Tasting', 6.00, 50, 49, 'Sommelier guided'),
(132, 63, 'Orchestra Level', 18.00, 120, 118, 'Best opera seats'),
(133, 63, 'Balcony', 2.50, 90, 89, 'Upper level view'),
(134, 64, 'Investor Pass', 6.00, 90, 89, 'Network with investors'),
(135, 64, 'Startup Pass', 4.00, 70, 69, 'Startup entry'),
(136, 65, 'Beach Party', 18.00, 120, 119, 'Season opening party'),
(137, 65, 'VIP Cabana', 38.00, 50, 49, 'Private cabana access'),

-- Events 71-80 continued
(138, 66, 'Rock Fest', 2.50, 250, 248, 'May Day festival'),
(139, 66, 'VIP Access', 2.50, 120, 120, 'VIP area access'),
(140, 67, 'Dance Show', 18.00, 120, 119, 'Modern dance showcase'),
(141, 67, 'Premium', 4.00, 90, 89, 'Front section'),
(142, 68, 'Film Week', 4.00, 90, 89, 'All screenings'),
(143, 68, 'Single Film', 4.00, 120, 119, 'One screening'),
(144, 69, 'Conference', 22.00, 120, 119, 'Full conference'),
(145, 69, 'Single Day', 6.00, 90, 89, 'One day pass'),
(146, 70, 'Tournament', 2.50, 70, 68, 'Beach sports entry'),
(147, 70, 'Spectator', 4.00, 120, 118, 'Watch the games'),

-- Events 81-90
(148, 71, 'Festival Pass', 32.00, 250, 250, 'Midsummer music'),
(149, 71, 'Evening Only', 2.50, 250, 250, 'Evening access'),
(150, 72, 'Comedy Tour', 32.00, 120, 120, 'Summer comedy tour'),
(151, 72, 'VIP Meet', 18.00, 70, 70, 'Meet comedians'),
(152, 73, 'Theater Entry', 28.00, 120, 120, 'Ancient drama'),
(153, 73, 'Premium', 6.00, 90, 90, 'Best outdoor seats'),
(154, 74, 'Cooking Class', 22.00, 50, 50, 'Mediterranean cooking'),
(155, 74, 'Demo Only', 18.00, 80, 80, 'Watch demonstration'),
(156, 75, 'Exhibition', 18.00, 120, 120, 'Marine photography'),
(157, 75, 'Private Tour', 28.00, 50, 50, 'Guided tour'),

(158, 76, 'Week Pass', 4.00, 120, 120, 'Full week festival'),
(159, 76, 'Day Pass', 22.00, 250, 250, 'Single day'),
(160, 77, 'Concert Series', 2.50, 90, 90, 'Three concerts'),
(161, 77, 'Single Concert', 18.00, 90, 90, 'One performance'),
(162, 78, 'Jazz Sunset', 28.00, 120, 120, 'Santorini jazz'),
(163, 78, 'Premium View', 22.00, 90, 90, 'Best caldera view'),
(164, 79, 'Hip Hop Summit', 22.00, 250, 250, 'Conference and shows'),
(165, 79, 'VIP Access', 42.00, 90, 90, 'VIP area'),
(166, 80, 'Crew Entry', 62.00, 60, 60, 'Sailing team fee'),
(167, 80, 'Spectator', 6.00, 70, 70, 'Watch competition'),

-- Events 81-90 continued
(168, 81, 'Food Carnival', 6.00, 250, 250, 'Street food festival'),
(169, 81, 'VIP Tasting', 4.00, 90, 90, 'Premium vendors'),
(170, 82, 'Festival 3-Day', 6.00, 250, 250, 'Full beach festival'),
(171, 82, 'Single Day', 22.00, 250, 250, 'One day access'),
(172, 83, 'Folk Festival', 28.00, 120, 120, 'Traditional dance'),
(173, 83, 'Family', 22.00, 90, 90, 'Family of 4'),
(174, 84, 'Cinema Night', 14.00, 120, 120, 'Summer cinema'),
(175, 84, 'Double Film', 22.00, 90, 90, 'Two films'),
(176, 85, 'Photo Workshop', 2.50, 35, 35, 'Mountain photography'),
(177, 85, 'Observer', 6.00, 25, 25, 'Watch only'),

(178, 86, 'Festival Pass', 28.00, 120, 120, 'Film festival'),
(179, 86, 'Day Pass', 2.50, 120, 120, 'Single day'),
(180, 87, 'Wine Festival', 18.00, 250, 250, 'Autumn wine fest'),
(181, 87, 'Premium Tasting', 18.00, 90, 90, 'Premium wines'),
(182, 88, 'Biennale Pass', 22.00, 120, 120, 'Full art biennale'),
(183, 88, 'Single Visit', 18.00, 120, 120, 'One visit'),
(184, 89, 'All Night', 32.00, 120, 120, 'Rembetika marathon'),
(185, 89, 'VIP Table', 2.50, 70, 70, 'Reserved table'),
(186, 90, 'Marathon', 22.00, 6000, 6000, 'Athens marathon'),
(187, 90, 'Half Marathon', 4.00, 250, 250, 'Half distance'),

-- Events 91-100
(188, 91, 'Halloween Show', 6.00, 120, 120, 'Haunted theater'),
(189, 91, 'VIP Experience', 6.00, 70, 70, 'Backstage access'),
(190, 92, 'Jazz Festival', 4.00, 120, 120, 'Autumn jazz'),
(191, 92, 'Single Night', 18.00, 120, 120, 'One night'),
(192, 93, 'Summit Pass', 18.00, 120, 120, 'Entrepreneurship'),
(193, 93, 'Startup Ticket', 4.00, 90, 90, 'Startup entry'),
(194, 94, 'Light Festival', 18.00, 250, 250, 'Winter lights'),
(195, 94, 'Guided Tour', 18.00, 90, 90, 'Expert tour'),
(196, 95, 'Market Entry', 6.00, 250, 250, 'Christmas market'),
(197, 95, 'Workshop', 28.00, 90, 90, 'Craft workshops'),
(198, 96, 'Symphony NYE', 22.00, 250, 250, 'New Year concert'),
(199, 96, 'VIP Champagne', 22.00, 90, 90, 'VIP experience'),
(200, 97, 'Comedy Special', 4.00, 120, 120, 'Holiday comedy'),
(201, 97, 'Premium', 6.00, 90, 90, 'Front seats'),
(202, 98, 'Gala Entry', 28.00, 120, 120, 'Sports gala'),
(203, 98, 'VIP', 28.00, 70, 70, 'VIP reception'),
(204, 99, 'Orchestra', 2.50, 120, 120, 'Chamber music'),
(205, 99, 'Student', 22.00, 70, 70, 'Student rate'),
(206, 100, 'Theater Gala', 18.00, 120, 120, 'Year-end gala'),
(207, 100, 'All Access', 4.00, 70, 70, 'Full access pass'),
-- Ticket types for events 101-120
(208, 101, 'General', 15.00, 90, 90, 'Standing'),
(209, 101, 'VIP', 30.00, 30, 30, 'VIP section'),
(210, 102, 'Entry', 10.00, 200, 200, 'Festival'),
(211, 102, 'VIP', 25.00, 80, 80, 'VIP access'),
(212, 103, 'Standard', 65.00, 100, 100, 'Expo'),
(213, 103, 'Exhibitor', 120.00, 40, 40, 'Full access'),
(214, 104, 'Entry', 12.00, 80, 80, 'Club'),
(215, 104, 'VIP', 40.00, 20, 20, 'VIP table'),
(216, 105, 'Orchestra', 45.00, 120, 120, 'Best seats'),
(217, 105, 'Balcony', 28.00, 80, 80, 'Upper'),
(218, 106, 'General', 20.00, 60, 60, 'Standard'),
(219, 106, 'VIP', 38.00, 25, 25, 'Premium'),
(220, 107, 'Entry', 18.00, 100, 100, 'Exhibition'),
(221, 107, 'Workshop', 45.00, 30, 30, 'Workshop'),
(222, 108, 'Lower', 30.00, 8000, 8000, 'Lower bowl'),
(223, 108, 'Upper', 15.00, 12000, 12000, 'Upper bowl'),
(224, 109, 'Entry', 32.00, 50, 50, 'Music'),
(225, 109, 'VIP', 65.00, 20, 20, 'VIP table'),
(226, 110, 'Entry', 12.00, 150, 150, 'Festival'),
(227, 111, 'Regular', 22.00, 80, 80, 'Standard'),
(228, 111, 'Premium', 35.00, 30, 30, 'Front'),
(229, 112, 'Entry', 15.00, 200, 200, 'Festival'),
(230, 112, 'Tasting', 35.00, 100, 100, 'Premium'),
(231, 113, 'Standard', 70.00, 100, 100, 'Conference'),
(232, 113, 'VIP', 130.00, 40, 40, 'VIP'),
(233, 114, 'Entry', 15.00, 80, 80, 'Dance'),
(234, 114, 'VIP', 35.00, 30, 30, 'VIP'),
(235, 115, 'Regular', 35.00, 100, 100, 'Standard'),
(236, 115, 'Premium', 55.00, 40, 40, 'Premium'),
(237, 116, 'General', 18.00, 50, 50, 'Standard'),
(238, 116, 'VIP', 32.00, 20, 20, 'Premium'),
(239, 117, 'Workshop', 75.00, 30, 30, 'Full day'),
(240, 118, 'General', 20.00, 150, 150, 'Arena'),
(241, 118, 'VIP', 40.00, 50, 50, 'Premium'),
(242, 119, 'Orchestra', 60.00, 150, 150, 'Best'),
(243, 119, 'Balcony', 35.00, 120, 120, 'Upper'),
(244, 120, 'Pass', 45.00, 90, 90, 'All shows'),
(245, 120, 'Single', 20.00, 120, 120, 'One show');


-- ========================================
-- ORDERS FOR PAST EVENTS
-- ========================================

INSERT INTO orders (id, user_id, event_id, total_amount, status, order_date) VALUES
-- User 1 orders (10 orders)
(1, 1, 1, 37.50, 'CONFIRMED', '2024-12-20 10:00:00'),
(2, 1, 2, 45.00, 'CONFIRMED', '2024-12-22 14:00:00'),
(3, 1, 5, 30.00, 'CONFIRMED', '2025-01-05 16:00:00'),
(4, 1, 9, 60.00, 'CONFIRMED', '2025-03-10 12:00:00'),
(5, 1, 15, 52.50, 'CONFIRMED', '2025-04-20 11:00:00'),
(6, 1, 21, 65.00, 'CONFIRMED', '2025-06-15 10:00:00'),
(7, 1, 26, 95.00, 'CONFIRMED', '2025-07-05 13:00:00'),
(8, 1, 32, 90.00, 'CONFIRMED', '2025-08-05 14:00:00'),
(9, 1, 39, 42.00, 'CONFIRMED', '2025-09-20 11:00:00'),
(10, 1, 46, 120.00, 'CONFIRMED', '2025-12-25 15:00:00'),

-- User 2 orders (8 orders)
(11, 2, 1, 50.00, 'CONFIRMED', '2024-12-21 09:00:00'),
(12, 2, 4, 80.00, 'CONFIRMED', '2025-01-03 10:00:00'),
(13, 2, 11, 40.00, 'CONFIRMED', '2025-04-10 13:00:00'),
(14, 2, 16, 67.50, 'CONFIRMED', '2025-04-25 11:00:00'),
(15, 2, 22, 48.00, 'CONFIRMED', '2025-06-10 12:00:00'),
(16, 2, 29, 60.00, 'CONFIRMED', '2025-07-20 10:00:00'),
(17, 2, 36, 70.00, 'CONFIRMED', '2025-09-01 14:00:00'),
(18, 2, 42, 82.50, 'CONFIRMED', '2025-11-05 15:00:00'),

-- User 3 orders (9 orders)
(19, 3, 2, 32.50, 'CONFIRMED', '2024-12-23 11:00:00'),
(20, 3, 7, 50.00, 'CONFIRMED', '2025-03-18 12:00:00'),
(21, 3, 12, 67.50, 'CONFIRMED', '2025-04-15 10:00:00'),
(22, 3, 18, 62.00, 'CONFIRMED', '2025-05-05 13:00:00'),
(23, 3, 25, 25.50, 'CONFIRMED', '2025-06-05 11:00:00'),
(24, 3, 31, 42.50, 'CONFIRMED', '2025-07-28 14:00:00'),
(25, 3, 37, 52.50, 'CONFIRMED', '2025-09-12 12:00:00'),
(26, 3, 43, 120.00, 'CONFIRMED', '2025-11-15 10:00:00'),
(27, 3, 47, 42.00, 'CONFIRMED', '2025-12-18 13:00:00'),

-- User 4 orders (7 orders)
(28, 4, 3, 18.00, 'CONFIRMED', '2025-01-02 10:00:00'),
(29, 4, 10, 180.00, 'CONFIRMED', '2025-03-05 11:00:00'),
(30, 4, 20, 37.50, 'CONFIRMED', '2025-05-15 12:00:00'),
(31, 4, 27, 52.50, 'CONFIRMED', '2025-07-10 13:00:00'),
(32, 4, 34, 18.00, 'CONFIRMED', '2025-08-18 14:00:00'),
(33, 4, 40, 20.00, 'CONFIRMED', '2025-09-25 10:00:00'),
(34, 4, 48, 75.00, 'CONFIRMED', '2025-12-12 11:00:00'),

-- User 5 orders (8 orders)
(35, 5, 6, 25.00, 'CONFIRMED', '2025-02-10 10:00:00'),
(36, 5, 13, 47.50, 'CONFIRMED', '2025-04-18 11:00:00'),
(37, 5, 19, 150.00, 'CONFIRMED', '2025-05-10 12:00:00'),
(38, 5, 23, 37.50, 'CONFIRMED', '2025-06-08 13:00:00'),
(39, 5, 30, 30.00, 'CONFIRMED', '2025-07-25 14:00:00'),
(40, 5, 35, 225.00, 'CONFIRMED', '2025-08-22 10:00:00'),
(41, 5, 41, 33.00, 'CONFIRMED', '2025-10-28 11:00:00'),
(42, 5, 45, 25.00, 'CONFIRMED', '2025-12-02 12:00:00'),

-- Users 6-15 orders (40 orders)
(43, 6, 1, 25.00, 'CONFIRMED', '2024-12-22 10:00:00'),
(44, 6, 8, 62.50, 'CONFIRMED', '2025-03-15 11:00:00'),
(45, 6, 14, 30.00, 'CONFIRMED', '2025-04-22 12:00:00'),
(46, 6, 24, 80.00, 'CONFIRMED', '2025-06-03 13:00:00'),
(47, 7, 5, 35.00, 'CONFIRMED', '2025-01-08 10:00:00'),
(48, 7, 17, 50.00, 'CONFIRMED', '2025-05-03 11:00:00'),
(49, 7, 28, 80.00, 'CONFIRMED', '2025-07-18 12:00:00'),
(50, 7, 38, 80.00, 'CONFIRMED', '2025-09-18 13:00:00'),

(51, 8, 9, 30.00, 'CONFIRMED', '2025-03-12 10:00:00'),
(52, 8, 16, 45.00, 'CONFIRMED', '2025-04-28 11:00:00'),
(53, 8, 33, 37.50, 'CONFIRMED', '2025-08-12 12:00:00'),
(54, 8, 44, 22.50, 'CONFIRMED', '2025-11-28 13:00:00'),

(55, 9, 11, 60.00, 'CONFIRMED', '2025-04-12 10:00:00'),
(56, 9, 21, 65.00, 'CONFIRMED', '2025-06-18 11:00:00'),
(57, 9, 32, 67.50, 'CONFIRMED', '2025-08-08 12:00:00'),
(58, 9, 42, 55.00, 'CONFIRMED', '2025-11-08 13:00:00'),

(59, 10, 15, 70.00, 'CONFIRMED', '2025-04-25 10:00:00'),
(60, 10, 26, 40.00, 'CONFIRMED', '2025-07-08 11:00:00'),
(61, 10, 39, 28.00, 'CONFIRMED', '2025-09-22 12:00:00'),
(62, 10, 49, 52.50, 'CONFIRMED', '2025-12-08 13:00:00'),

(63, 11, 4, 115.00, 'CONFIRMED', '2025-01-05 10:00:00'),
(64, 11, 18, 30.00, 'CONFIRMED', '2025-05-08 11:00:00'),
(65, 11, 29, 80.00, 'CONFIRMED', '2025-07-23 12:00:00'),
(66, 11, 43, 85.00, 'CONFIRMED', '2025-11-18 13:00:00'),

(67, 12, 7, 75.00, 'CONFIRMED', '2025-03-20 10:00:00'),
(68, 12, 22, 60.00, 'CONFIRMED', '2025-06-12 11:00:00'),
(69, 12, 36, 87.50, 'CONFIRMED', '2025-09-03 12:00:00'),
(70, 12, 46, 150.00, 'CONFIRMED', '2025-12-28 13:00:00'),

(71, 13, 12, 45.00, 'CONFIRMED', '2025-04-18 10:00:00'),
(72, 13, 27, 35.00, 'CONFIRMED', '2025-07-12 11:00:00'),
(73, 13, 40, 40.00, 'CONFIRMED', '2025-09-26 12:00:00'),
(74, 13, 50, 60.00, 'CONFIRMED', '2025-12-16 13:00:00'),

(75, 14, 13, 47.50, 'CONFIRMED', '2025-04-22 10:00:00'),
(76, 14, 25, 33.00, 'CONFIRMED', '2025-06-06 11:00:00'),
(77, 14, 37, 60.00, 'CONFIRMED', '2025-09-15 12:00:00'),
(78, 14, 48, 100.00, 'CONFIRMED', '2025-12-13 13:00:00'),

(79, 15, 19, 225.00, 'CONFIRMED', '2025-05-12 10:00:00'),
(80, 15, 31, 60.00, 'CONFIRMED', '2025-07-30 11:00:00'),
(81, 15, 41, 44.00, 'CONFIRMED', '2025-10-29 12:00:00'),
(82, 15, 47, 56.00, 'CONFIRMED', '2025-12-19 13:00:00'),

-- Users 16-25 orders (30 orders)
(83, 16, 2, 37.50, 'CONFIRMED', '2024-12-24 10:00:00'),
(84, 16, 23, 50.00, 'CONFIRMED', '2025-06-08 11:00:00'),
(85, 16, 34, 24.00, 'CONFIRMED', '2025-08-20 12:00:00'),

(86, 17, 10, 120.00, 'CONFIRMED', '2025-03-07 10:00:00'),
(87, 17, 30, 45.00, 'CONFIRMED', '2025-07-26 11:00:00'),
(88, 17, 45, 37.50, 'CONFIRMED', '2025-12-03 12:00:00'),

(89, 18, 14, 50.00, 'CONFIRMED', '2025-04-23 10:00:00'),
(90, 18, 28, 100.00, 'CONFIRMED', '2025-07-18 11:00:00'),
(91, 18, 44, 30.00, 'CONFIRMED', '2025-11-29 12:00:00'),

(92, 19, 20, 25.00, 'CONFIRMED', '2025-05-17 10:00:00'),
(93, 19, 33, 50.00, 'CONFIRMED', '2025-08-13 11:00:00'),
(94, 19, 49, 35.00, 'CONFIRMED', '2025-12-09 12:00:00'),

(95, 20, 3, 30.00, 'CONFIRMED', '2025-01-03 10:00:00'),
(96, 20, 24, 120.00, 'CONFIRMED', '2025-06-02 11:00:00'),
(97, 20, 38, 120.00, 'CONFIRMED', '2025-09-18 12:00:00'),

(98, 21, 6, 20.00, 'CONFIRMED', '2025-02-12 10:00:00'),
(99, 21, 35, 150.00, 'CONFIRMED', '2025-08-24 11:00:00'),
(100, 21, 50, 75.00, 'CONFIRMED', '2025-12-17 12:00:00'),

(101, 22, 17, 75.00, 'CONFIRMED', '2025-05-01 10:00:00'),
(102, 22, 26, 60.00, 'CONFIRMED', '2025-07-09 11:00:00'),
(103, 22, 42, 82.50, 'CONFIRMED', '2025-11-09 12:00:00'),

(104, 23, 8, 62.50, 'CONFIRMED', '2025-03-18 10:00:00'),
(105, 23, 32, 90.00, 'CONFIRMED', '2025-08-09 11:00:00'),
(106, 23, 46, 160.00, 'CONFIRMED', '2025-12-29 12:00:00'),

(107, 24, 9, 60.00, 'CONFIRMED', '2025-03-13 10:00:00'),
(108, 24, 29, 100.00, 'CONFIRMED', '2025-07-24 11:00:00'),
(109, 24, 43, 85.00, 'CONFIRMED', '2025-11-19 12:00:00'),

(110, 25, 15, 87.50, 'CONFIRMED', '2025-04-27 10:00:00'),
(111, 25, 36, 105.00, 'CONFIRMED', '2025-09-04 11:00:00'),
(112, 25, 47, 70.00, 'CONFIRMED', '2025-12-20 12:00:00'),

-- Users 26-30 orders (18 orders)
(113, 26, 11, 80.00, 'CONFIRMED', '2025-04-14 10:00:00'),
(114, 26, 27, 52.50, 'CONFIRMED', '2025-07-13 11:00:00'),
(115, 26, 40, 50.00, 'CONFIRMED', '2025-09-27 12:00:00'),
(116, 26, 48, 125.00, 'CONFIRMED', '2025-12-14 13:00:00'),

(117, 27, 16, 67.50, 'CONFIRMED', '2025-04-29 10:00:00'),
(118, 27, 31, 70.00, 'CONFIRMED', '2025-08-02 11:00:00'),
(119, 27, 39, 56.00, 'CONFIRMED', '2025-09-23 12:00:00'),
(120, 27, 45, 50.00, 'CONFIRMED', '2025-12-04 13:00:00'),

(121, 28, 19, 180.00, 'CONFIRMED', '2025-05-13 10:00:00'),
(122, 28, 37, 75.00, 'CONFIRMED', '2025-09-16 11:00:00'),
(123, 28, 44, 37.50, 'CONFIRMED', '2025-12-01 12:00:00'),

(124, 29, 21, 97.50, 'CONFIRMED', '2025-06-19 10:00:00'),
(125, 29, 33, 75.00, 'CONFIRMED', '2025-08-14 11:00:00'),
(126, 29, 41, 55.00, 'CONFIRMED', '2025-10-30 12:00:00'),

(127, 30, 22, 75.00, 'CONFIRMED', '2025-06-13 10:00:00'),
(128, 30, 34, 30.00, 'CONFIRMED', '2025-08-21 11:00:00'),
(129, 30, 42, 110.00, 'CONFIRMED', '2025-11-10 12:00:00'),
(130, 30, 50, 90.00, 'CONFIRMED', '2025-12-18 13:00:00');

-- ========================================
-- ORDERS FOR UPCOMING EVENTS
-- ========================================

INSERT INTO orders (id, user_id, event_id, total_amount, status, order_date) VALUES
(131, 1, 51, 18.00, 'CONFIRMED', '2026-01-10 10:00:00'),
(132, 2, 52, 35.00, 'CONFIRMED', '2026-01-12 12:30:00'),
(133, 3, 53, 27.50, 'CONFIRMED', '2026-01-13 09:15:00'),
(134, 4, 54, 140.00, 'CONFIRMED', '2026-01-14 18:10:00'),
(135, 5, 55, 37.50, 'CONFIRMED', '2026-01-15 20:45:00'),

(136, 6, 56, 60.00, 'CONFIRMED', '2026-01-16 11:05:00'),
(137, 7, 57, 42.50, 'CONFIRMED', '2026-01-16 12:00:00'),
(138, 8, 58, 47.50, 'CONFIRMED', '2026-01-17 14:20:00'),
(139, 9, 59, 87.50, 'CONFIRMED', '2026-01-18 09:40:00'),
(140, 10, 60, 20.00, 'CONFIRMED', '2026-01-18 21:10:00'),

(141, 11, 61, 55.00, 'CONFIRMED', '2026-01-19 10:10:00'),
(142, 12, 62, 80.00, 'CONFIRMED', '2026-01-19 13:25:00'),
(143, 13, 63, 90.00, 'CONFIRMED', '2026-01-19 15:00:00'),
(144, 14, 64, 40.00, 'CONFIRMED', '2026-01-19 17:45:00'),
(145, 15, 65, 92.50, 'CONFIRMED', '2026-01-19 20:30:00'),

(146, 16, 66, 40.00, 'CONFIRMED', '2026-01-20 09:05:00'),
(147, 17, 67, 47.50, 'CONFIRMED', '2026-01-20 11:20:00'),
(148, 18, 68, 37.50, 'CONFIRMED', '2026-01-20 12:10:00'),
(149, 19, 69, 140.00, 'CONFIRMED', '2026-01-20 13:40:00'),
(150, 20, 70, 28.00, 'CONFIRMED', '2026-01-20 16:00:00');

-- Additional 70 orders (151-220)
INSERT INTO orders (id, user_id, event_id, total_amount, status, order_date) VALUES
(151, 1, 101, 45.00, 'CONFIRMED', '2026-01-24 09:00:00'),
(152, 2, 102, 30.00, 'CONFIRMED', '2026-01-24 10:00:00'),
(153, 3, 103, 65.00, 'CONFIRMED', '2026-01-24 11:00:00'),
(154, 4, 104, 36.00, 'CONFIRMED', '2026-01-24 12:00:00'),
(155, 5, 105, 90.00, 'CONFIRMED', '2026-01-24 13:00:00'),
(156, 6, 106, 60.00, 'CONFIRMED', '2026-01-24 14:00:00'),
(157, 7, 107, 54.00, 'CONFIRMED', '2026-01-24 15:00:00'),
(158, 8, 108, 60.00, 'CONFIRMED', '2026-01-24 16:00:00'),
(159, 9, 109, 48.00, 'CONFIRMED', '2026-01-24 17:00:00'),
(160, 10, 110, 36.00, 'CONFIRMED', '2026-01-24 18:00:00'),
(161, 11, 111, 45.00, 'CONFIRMED', '2026-01-24 19:00:00'),
(162, 12, 112, 30.00, 'CONFIRMED', '2026-01-24 20:00:00'),
(163, 13, 113, 65.00, 'CONFIRMED', '2026-01-24 21:00:00'),
(164, 14, 114, 36.00, 'CONFIRMED', '2026-01-24 22:00:00'),
(165, 15, 115, 90.00, 'CONFIRMED', '2026-01-24 23:00:00'),
(166, 16, 116, 60.00, 'CONFIRMED', '2026-01-25 00:00:00'),
(167, 17, 117, 54.00, 'CONFIRMED', '2026-01-25 09:00:00'),
(168, 18, 118, 60.00, 'CONFIRMED', '2026-01-25 10:00:00'),
(169, 19, 119, 48.00, 'CONFIRMED', '2026-01-25 11:00:00'),
(170, 20, 120, 36.00, 'CONFIRMED', '2026-01-25 12:00:00'),
(171, 21, 101, 45.00, 'CONFIRMED', '2026-01-25 13:00:00'),
(172, 22, 102, 30.00, 'CONFIRMED', '2026-01-25 14:00:00'),
(173, 23, 103, 65.00, 'CONFIRMED', '2026-01-25 15:00:00'),
(174, 24, 104, 36.00, 'CONFIRMED', '2026-01-25 16:00:00'),
(175, 25, 105, 90.00, 'CONFIRMED', '2026-01-25 17:00:00'),
(176, 26, 106, 60.00, 'CONFIRMED', '2026-01-25 18:00:00'),
(177, 27, 107, 54.00, 'CONFIRMED', '2026-01-25 19:00:00'),
(178, 28, 108, 60.00, 'CONFIRMED', '2026-01-25 20:00:00'),
(179, 29, 109, 48.00, 'CONFIRMED', '2026-01-25 21:00:00'),
(180, 30, 110, 36.00, 'CONFIRMED', '2026-01-25 22:00:00'),
(181, 1, 111, 45.00, 'CONFIRMED', '2026-01-26 23:00:00'),
(182, 2, 112, 30.00, 'CONFIRMED', '2026-01-26 00:00:00'),
(183, 3, 113, 65.00, 'CONFIRMED', '2026-01-26 09:00:00'),
(184, 4, 114, 36.00, 'CONFIRMED', '2026-01-26 10:00:00'),
(185, 5, 115, 90.00, 'CONFIRMED', '2026-01-26 11:00:00'),
(186, 6, 116, 60.00, 'CONFIRMED', '2026-01-26 12:00:00'),
(187, 7, 117, 54.00, 'CONFIRMED', '2026-01-26 13:00:00'),
(188, 8, 118, 60.00, 'CONFIRMED', '2026-01-26 14:00:00'),
(189, 9, 119, 48.00, 'CONFIRMED', '2026-01-26 15:00:00'),
(190, 10, 120, 36.00, 'CONFIRMED', '2026-01-26 16:00:00'),
(191, 11, 101, 45.00, 'CONFIRMED', '2026-01-26 17:00:00'),
(192, 12, 102, 30.00, 'CONFIRMED', '2026-01-26 18:00:00'),
(193, 13, 103, 65.00, 'CONFIRMED', '2026-01-26 19:00:00'),
(194, 14, 104, 36.00, 'CONFIRMED', '2026-01-26 20:00:00'),
(195, 15, 105, 90.00, 'CONFIRMED', '2026-01-26 21:00:00'),
(196, 16, 106, 60.00, 'CONFIRMED', '2026-01-27 22:00:00'),
(197, 17, 107, 54.00, 'CONFIRMED', '2026-01-27 23:00:00'),
(198, 18, 108, 60.00, 'CONFIRMED', '2026-01-27 00:00:00'),
(199, 19, 109, 48.00, 'CONFIRMED', '2026-01-27 09:00:00'),
(200, 20, 110, 36.00, 'CONFIRMED', '2026-01-27 10:00:00'),
(201, 21, 111, 45.00, 'CONFIRMED', '2026-01-27 11:00:00'),
(202, 22, 112, 30.00, 'CONFIRMED', '2026-01-27 12:00:00'),
(203, 23, 113, 65.00, 'CONFIRMED', '2026-01-27 13:00:00'),
(204, 24, 114, 36.00, 'CONFIRMED', '2026-01-27 14:00:00'),
(205, 25, 115, 90.00, 'CONFIRMED', '2026-01-27 15:00:00'),
(206, 26, 116, 60.00, 'CONFIRMED', '2026-01-27 16:00:00'),
(207, 27, 117, 54.00, 'CONFIRMED', '2026-01-27 17:00:00'),
(208, 28, 118, 60.00, 'CONFIRMED', '2026-01-27 18:00:00'),
(209, 29, 119, 48.00, 'CONFIRMED', '2026-01-27 19:00:00'),
(210, 30, 120, 36.00, 'CONFIRMED', '2026-01-27 20:00:00'),
(211, 1, 101, 45.00, 'CONFIRMED', '2026-01-28 21:00:00'),
(212, 2, 102, 30.00, 'CONFIRMED', '2026-01-28 22:00:00'),
(213, 3, 103, 65.00, 'CONFIRMED', '2026-01-28 23:00:00'),
(214, 4, 104, 36.00, 'CONFIRMED', '2026-01-28 00:00:00'),
(215, 5, 105, 90.00, 'CONFIRMED', '2026-01-28 09:00:00'),
(216, 6, 106, 60.00, 'CONFIRMED', '2026-01-28 10:00:00'),
(217, 7, 107, 54.00, 'CONFIRMED', '2026-01-28 11:00:00'),
(218, 8, 108, 60.00, 'CONFIRMED', '2026-01-28 12:00:00'),
(219, 9, 109, 48.00, 'CONFIRMED', '2026-01-28 13:00:00'),
(220, 10, 110, 36.00, 'CONFIRMED', '2026-01-28 14:00:00');



-- ========================================
-- PAYMENTS
-- ========================================

INSERT INTO payments (id, user_id, order_id, amount, status, payment_method, transaction_id, payment_date) VALUES
-- Payments for orders 1-130
(1, 1, 1, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_001_2024', '2024-12-20 10:05:00'),
(2, 1, 2, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_002_2024', '2024-12-22 14:05:00'),
(3, 1, 3, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_003_2025', '2025-01-05 16:05:00'),
(4, 1, 4, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_004_2025', '2025-03-10 12:05:00'),
(5, 1, 5, 52.50, 'COMPLETED', 'CREDIT_CARD', 'pi_005_2025', '2025-04-20 11:05:00'),
(6, 1, 6, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_006_2025', '2025-06-15 10:05:00'),
(7, 1, 7, 95.00, 'COMPLETED', 'CREDIT_CARD', 'pi_007_2025', '2025-07-05 13:05:00'),
(8, 1, 8, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_008_2025', '2025-08-05 14:05:00'),
(9, 1, 9, 42.00, 'COMPLETED', 'CREDIT_CARD', 'pi_009_2025', '2025-09-20 11:05:00'),
(10, 1, 10, 120.00, 'COMPLETED', 'CREDIT_CARD', 'pi_010_2025', '2025-12-25 15:05:00'),

(11, 2, 11, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_011_2024', '2024-12-21 09:05:00'),
(12, 2, 12, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_012_2025', '2025-01-03 10:05:00'),
(13, 2, 13, 40.00, 'COMPLETED', 'CREDIT_CARD', 'pi_013_2025', '2025-04-10 13:05:00'),
(14, 2, 14, 67.50, 'COMPLETED', 'CREDIT_CARD', 'pi_014_2025', '2025-04-25 11:05:00'),
(15, 2, 15, 48.00, 'COMPLETED', 'CREDIT_CARD', 'pi_015_2025', '2025-06-10 12:05:00'),
(16, 2, 16, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_016_2025', '2025-07-20 10:05:00'),
(17, 2, 17, 70.00, 'COMPLETED', 'CREDIT_CARD', 'pi_017_2025', '2025-09-01 14:05:00'),
(18, 2, 18, 82.50, 'COMPLETED', 'CREDIT_CARD', 'pi_018_2025', '2025-11-05 15:05:00'),

(19, 3, 19, 32.50, 'COMPLETED', 'CREDIT_CARD', 'pi_019_2024', '2024-12-23 11:05:00'),
(20, 3, 20, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_020_2025', '2025-03-18 12:05:00'),
(21, 3, 21, 67.50, 'COMPLETED', 'CREDIT_CARD', 'pi_021_2025', '2025-04-15 10:05:00'),
(22, 3, 22, 62.00, 'COMPLETED', 'CREDIT_CARD', 'pi_022_2025', '2025-05-05 13:05:00'),
(23, 3, 23, 25.50, 'COMPLETED', 'CREDIT_CARD', 'pi_023_2025', '2025-06-05 11:05:00'),
(24, 3, 24, 42.50, 'COMPLETED', 'CREDIT_CARD', 'pi_024_2025', '2025-07-28 14:05:00'),
(25, 3, 25, 52.50, 'COMPLETED', 'CREDIT_CARD', 'pi_025_2025', '2025-09-12 12:05:00'),
(26, 3, 26, 120.00, 'COMPLETED', 'CREDIT_CARD', 'pi_026_2025', '2025-11-15 10:05:00'),
(27, 3, 27, 42.00, 'COMPLETED', 'CREDIT_CARD', 'pi_027_2025', '2025-12-18 13:05:00'),

(28, 4, 28, 18.00, 'COMPLETED', 'CREDIT_CARD', 'pi_028_2025', '2025-01-02 10:05:00'),
(29, 4, 29, 180.00, 'COMPLETED', 'CREDIT_CARD', 'pi_029_2025', '2025-03-05 11:05:00'),
(30, 4, 30, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_030_2025', '2025-05-15 12:05:00'),
(31, 4, 31, 52.50, 'COMPLETED', 'CREDIT_CARD', 'pi_031_2025', '2025-07-10 13:05:00'),
(32, 4, 32, 18.00, 'COMPLETED', 'CREDIT_CARD', 'pi_032_2025', '2025-08-18 14:05:00'),
(33, 4, 33, 20.00, 'COMPLETED', 'CREDIT_CARD', 'pi_033_2025', '2025-09-25 10:05:00'),
(34, 4, 34, 75.00, 'COMPLETED', 'CREDIT_CARD', 'pi_034_2025', '2025-12-12 11:05:00'),

(35, 5, 35, 25.00, 'COMPLETED', 'CREDIT_CARD', 'pi_035_2025', '2025-02-10 10:05:00'),
(36, 5, 36, 47.50, 'COMPLETED', 'CREDIT_CARD', 'pi_036_2025', '2025-04-18 11:05:00'),
(37, 5, 37, 150.00, 'COMPLETED', 'CREDIT_CARD', 'pi_037_2025', '2025-05-10 12:05:00'),
(38, 5, 38, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_038_2025', '2025-06-08 13:05:00'),
(39, 5, 39, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_039_2025', '2025-07-25 14:05:00'),
(40, 5, 40, 225.00, 'COMPLETED', 'CREDIT_CARD', 'pi_040_2025', '2025-08-22 10:05:00'),
(41, 5, 41, 33.00, 'COMPLETED', 'CREDIT_CARD', 'pi_041_2025', '2025-10-28 11:05:00'),
(42, 5, 42, 25.00, 'COMPLETED', 'CREDIT_CARD', 'pi_042_2025', '2025-12-02 12:05:00'),

(43, 6, 43, 25.00, 'COMPLETED', 'CREDIT_CARD', 'pi_043_2024', '2024-12-22 10:05:00'),
(44, 6, 44, 62.50, 'COMPLETED', 'CREDIT_CARD', 'pi_044_2025', '2025-03-15 11:05:00'),
(45, 6, 45, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_045_2025', '2025-04-22 12:05:00'),
(46, 6, 46, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_046_2025', '2025-06-03 13:05:00'),

(47, 7, 47, 35.00, 'COMPLETED', 'CREDIT_CARD', 'pi_047_2025', '2025-01-08 10:05:00'),
(48, 7, 48, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_048_2025', '2025-05-03 11:05:00'),
(49, 7, 49, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_049_2025', '2025-07-18 12:05:00'),
(50, 7, 50, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_050_2025', '2025-09-18 13:05:00'),

(51, 8, 51, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_051_2025', '2025-03-12 10:05:00'),
(52, 8, 52, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_052_2025', '2025-04-28 11:05:00'),
(53, 8, 53, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_053_2025', '2025-08-12 12:05:00'),
(54, 8, 54, 22.50, 'COMPLETED', 'CREDIT_CARD', 'pi_054_2025', '2025-11-28 13:05:00'),

(55, 9, 55, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_055_2025', '2025-04-12 10:05:00'),
(56, 9, 56, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_056_2025', '2025-06-18 11:05:00'),
(57, 9, 57, 67.50, 'COMPLETED', 'CREDIT_CARD', 'pi_057_2025', '2025-08-08 12:05:00'),
(58, 9, 58, 55.00, 'COMPLETED', 'CREDIT_CARD', 'pi_058_2025', '2025-11-08 13:05:00'),

(59, 10, 59, 70.00, 'COMPLETED', 'CREDIT_CARD', 'pi_059_2025', '2025-04-25 10:05:00'),
(60, 10, 60, 40.00, 'COMPLETED', 'CREDIT_CARD', 'pi_060_2025', '2025-07-08 11:05:00'),
(61, 10, 61, 28.00, 'COMPLETED', 'CREDIT_CARD', 'pi_061_2025', '2025-09-22 12:05:00'),
(62, 10, 62, 52.50, 'COMPLETED', 'CREDIT_CARD', 'pi_062_2025', '2025-12-08 13:05:00'),

(63, 11, 63, 115.00, 'COMPLETED', 'CREDIT_CARD', 'pi_063_2025', '2025-01-05 10:05:00'),
(64, 11, 64, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_064_2025', '2025-05-08 11:05:00'),
(65, 11, 65, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_065_2025', '2025-07-23 12:05:00'),
(66, 11, 66, 85.00, 'COMPLETED', 'CREDIT_CARD', 'pi_066_2025', '2025-11-18 13:05:00'),

(67, 12, 67, 75.00, 'COMPLETED', 'CREDIT_CARD', 'pi_067_2025', '2025-03-20 10:05:00'),
(68, 12, 68, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_068_2025', '2025-06-12 11:05:00'),
(69, 12, 69, 87.50, 'COMPLETED', 'CREDIT_CARD', 'pi_069_2025', '2025-09-03 12:05:00'),
(70, 12, 70, 150.00, 'COMPLETED', 'CREDIT_CARD', 'pi_070_2025', '2025-12-28 13:05:00'),

(71, 13, 71, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_071_2025', '2025-04-18 10:05:00'),
(72, 13, 72, 35.00, 'COMPLETED', 'CREDIT_CARD', 'pi_072_2025', '2025-07-12 11:05:00'),
(73, 13, 73, 40.00, 'COMPLETED', 'CREDIT_CARD', 'pi_073_2025', '2025-09-26 12:05:00'),
(74, 13, 74, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_074_2025', '2025-12-16 13:05:00'),

(75, 14, 75, 47.50, 'COMPLETED', 'CREDIT_CARD', 'pi_075_2025', '2025-04-22 10:05:00'),
(76, 14, 76, 33.00, 'COMPLETED', 'CREDIT_CARD', 'pi_076_2025', '2025-06-06 11:05:00'),
(77, 14, 77, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_077_2025', '2025-09-15 12:05:00'),
(78, 14, 78, 100.00, 'COMPLETED', 'CREDIT_CARD', 'pi_078_2025', '2025-12-13 13:05:00'),

(79, 15, 79, 225.00, 'COMPLETED', 'CREDIT_CARD', 'pi_079_2025', '2025-05-12 10:05:00'),
(80, 15, 80, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_080_2025', '2025-07-30 11:05:00'),
(81, 15, 81, 44.00, 'COMPLETED', 'CREDIT_CARD', 'pi_081_2025', '2025-10-29 12:05:00'),
(82, 15, 82, 56.00, 'COMPLETED', 'CREDIT_CARD', 'pi_082_2025', '2025-12-19 13:05:00'),

(83, 16, 83, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_083_2024', '2024-12-24 10:05:00'),
(84, 16, 84, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_084_2025', '2025-06-08 11:05:00'),
(85, 16, 85, 24.00, 'COMPLETED', 'CREDIT_CARD', 'pi_085_2025', '2025-08-20 12:05:00'),

(86, 17, 86, 120.00, 'COMPLETED', 'CREDIT_CARD', 'pi_086_2025', '2025-03-07 10:05:00'),
(87, 17, 87, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_087_2025', '2025-07-26 11:05:00'),
(88, 17, 88, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_088_2025', '2025-12-03 12:05:00'),

(89, 18, 89, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_089_2025', '2025-04-23 10:05:00'),
(90, 18, 90, 100.00, 'COMPLETED', 'CREDIT_CARD', 'pi_090_2025', '2025-07-18 11:05:00'),
(91, 18, 91, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_091_2025', '2025-11-29 12:05:00'),

(92, 19, 92, 25.00, 'COMPLETED', 'CREDIT_CARD', 'pi_092_2025', '2025-05-17 10:05:00'),
(93, 19, 93, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_093_2025', '2025-08-13 11:05:00'),
(94, 19, 94, 35.00, 'COMPLETED', 'CREDIT_CARD', 'pi_094_2025', '2025-12-09 12:05:00'),

(95, 20, 95, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_095_2025', '2025-01-03 10:05:00'),
(96, 20, 96, 120.00, 'COMPLETED', 'CREDIT_CARD', 'pi_096_2025', '2025-06-02 11:05:00'),
(97, 20, 97, 120.00, 'COMPLETED', 'CREDIT_CARD', 'pi_097_2025', '2025-09-18 12:05:00'),

(98, 21, 98, 20.00, 'COMPLETED', 'CREDIT_CARD', 'pi_098_2025', '2025-02-12 10:05:00'),
(99, 21, 99, 150.00, 'COMPLETED', 'CREDIT_CARD', 'pi_099_2025', '2025-08-24 11:05:00'),
(100, 21, 100, 75.00, 'COMPLETED', 'CREDIT_CARD', 'pi_100_2025', '2025-12-17 12:05:00'),

(101, 22, 101, 75.00, 'COMPLETED', 'CREDIT_CARD', 'pi_101_2025', '2025-05-01 10:05:00'),
(102, 22, 102, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_102_2025', '2025-07-09 11:05:00'),
(103, 22, 103, 82.50, 'COMPLETED', 'CREDIT_CARD', 'pi_103_2025', '2025-11-09 12:05:00'),

(104, 23, 104, 62.50, 'COMPLETED', 'CREDIT_CARD', 'pi_104_2025', '2025-03-18 10:05:00'),
(105, 23, 105, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_105_2025', '2025-08-09 11:05:00'),
(106, 23, 106, 160.00, 'COMPLETED', 'CREDIT_CARD', 'pi_106_2025', '2025-12-29 12:05:00'),

(107, 24, 107, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_107_2025', '2025-03-13 10:05:00'),
(108, 24, 108, 100.00, 'COMPLETED', 'CREDIT_CARD', 'pi_108_2025', '2025-07-24 11:05:00'),
(109, 24, 109, 85.00, 'COMPLETED', 'CREDIT_CARD', 'pi_109_2025', '2025-11-19 12:05:00'),

(110, 25, 110, 87.50, 'COMPLETED', 'CREDIT_CARD', 'pi_110_2025', '2025-04-27 10:05:00'),
(111, 25, 111, 105.00, 'COMPLETED', 'CREDIT_CARD', 'pi_111_2025', '2025-09-04 11:05:00'),
(112, 25, 112, 70.00, 'COMPLETED', 'CREDIT_CARD', 'pi_112_2025', '2025-12-20 12:05:00'),

(113, 26, 113, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_113_2025', '2025-04-14 10:05:00'),
(114, 26, 114, 52.50, 'COMPLETED', 'CREDIT_CARD', 'pi_114_2025', '2025-07-13 11:05:00'),
(115, 26, 115, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_115_2025', '2025-09-27 12:05:00'),
(116, 26, 116, 125.00, 'COMPLETED', 'CREDIT_CARD', 'pi_116_2025', '2025-12-14 13:05:00'),

(117, 27, 117, 67.50, 'COMPLETED', 'CREDIT_CARD', 'pi_117_2025', '2025-04-29 10:05:00'),
(118, 27, 118, 70.00, 'COMPLETED', 'CREDIT_CARD', 'pi_118_2025', '2025-08-02 11:05:00'),
(119, 27, 119, 56.00, 'COMPLETED', 'CREDIT_CARD', 'pi_119_2025', '2025-09-23 12:05:00'),
(120, 27, 120, 50.00, 'COMPLETED', 'CREDIT_CARD', 'pi_120_2025', '2025-12-04 13:05:00'),

(121, 28, 121, 180.00, 'COMPLETED', 'CREDIT_CARD', 'pi_121_2025', '2025-05-13 10:05:00'),
(122, 28, 122, 75.00, 'COMPLETED', 'CREDIT_CARD', 'pi_122_2025', '2025-09-16 11:05:00'),
(123, 28, 123, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_123_2025', '2025-12-01 12:05:00'),

(124, 29, 124, 97.50, 'COMPLETED', 'CREDIT_CARD', 'pi_124_2025', '2025-06-19 10:05:00'),
(125, 29, 125, 75.00, 'COMPLETED', 'CREDIT_CARD', 'pi_125_2025', '2025-08-14 11:05:00'),
(126, 29, 126, 55.00, 'COMPLETED', 'CREDIT_CARD', 'pi_126_2025', '2025-10-30 12:05:00'),

(127, 30, 127, 75.00, 'COMPLETED', 'CREDIT_CARD', 'pi_127_2025', '2025-06-13 10:05:00'),
(128, 30, 128, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_128_2025', '2025-08-21 11:05:00'),
(129, 30, 129, 110.00, 'COMPLETED', 'CREDIT_CARD', 'pi_129_2025', '2025-11-10 12:05:00'),
(130, 30, 130, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_130_2025', '2025-12-18 13:05:00');

-- ========================================
-- PAYMENTS FOR UPCOMING ORDERS (131-150)
-- ========================================

INSERT INTO payments (id, user_id, order_id, amount, status, payment_method, transaction_id, payment_date) VALUES
(131, 1, 131, 18.00, 'COMPLETED', 'CREDIT_CARD', 'pi_131_2026', '2026-01-10 10:05:00'),
(132, 2, 132, 35.00, 'COMPLETED', 'CREDIT_CARD', 'pi_132_2026', '2026-01-12 12:35:00'),
(133, 3, 133, 27.50, 'COMPLETED', 'CREDIT_CARD', 'pi_133_2026', '2026-01-13 09:20:00'),
(134, 4, 134, 140.00, 'COMPLETED', 'CREDIT_CARD', 'pi_134_2026', '2026-01-14 18:15:00'),
(135, 5, 135, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_135_2026', '2026-01-15 20:50:00'),

(136, 6, 136, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_136_2026', '2026-01-16 11:10:00'),
(137, 7, 137, 42.50, 'COMPLETED', 'CREDIT_CARD', 'pi_137_2026', '2026-01-16 12:05:00'),
(138, 8, 138, 47.50, 'COMPLETED', 'CREDIT_CARD', 'pi_138_2026', '2026-01-17 14:25:00'),
(139, 9, 139, 87.50, 'COMPLETED', 'CREDIT_CARD', 'pi_139_2026', '2026-01-18 09:45:00'),
(140, 10, 140, 20.00, 'COMPLETED', 'CREDIT_CARD', 'pi_140_2026', '2026-01-18 21:15:00'),

(141, 11, 141, 55.00, 'COMPLETED', 'CREDIT_CARD', 'pi_141_2026', '2026-01-19 10:15:00'),
(142, 12, 142, 80.00, 'COMPLETED', 'CREDIT_CARD', 'pi_142_2026', '2026-01-19 13:30:00'),
(143, 13, 143, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_143_2026', '2026-01-19 15:05:00'),
(144, 14, 144, 40.00, 'COMPLETED', 'CREDIT_CARD', 'pi_144_2026', '2026-01-19 17:50:00'),
(145, 15, 145, 92.50, 'COMPLETED', 'CREDIT_CARD', 'pi_145_2026', '2026-01-19 20:35:00'),

(146, 16, 146, 40.00, 'COMPLETED', 'CREDIT_CARD', 'pi_146_2026', '2026-01-20 09:10:00'),
(147, 17, 147, 47.50, 'COMPLETED', 'CREDIT_CARD', 'pi_147_2026', '2026-01-20 11:25:00'),
(148, 18, 148, 37.50, 'COMPLETED', 'CREDIT_CARD', 'pi_148_2026', '2026-01-20 12:15:00'),
(149, 19, 149, 140.00, 'COMPLETED', 'CREDIT_CARD', 'pi_149_2026', '2026-01-20 13:45:00'),
(150, 20, 150, 28.00, 'COMPLETED', 'CREDIT_CARD', 'pi_150_2026', '2026-01-20 16:05:00');

-- Additional 70 payments (151-220)
INSERT INTO payments (id, user_id, order_id, amount, status, payment_method, transaction_id, payment_date) VALUES
(151, 1, 151, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_151_2026', '2026-01-24 09:05:00'),
(152, 2, 152, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_152_2026', '2026-01-24 10:05:00'),
(153, 3, 153, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_153_2026', '2026-01-24 11:05:00'),
(154, 4, 154, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_154_2026', '2026-01-24 12:05:00'),
(155, 5, 155, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_155_2026', '2026-01-24 13:05:00'),
(156, 6, 156, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_156_2026', '2026-01-24 14:05:00'),
(157, 7, 157, 54.00, 'COMPLETED', 'CREDIT_CARD', 'pi_157_2026', '2026-01-24 15:05:00'),
(158, 8, 158, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_158_2026', '2026-01-24 16:05:00'),
(159, 9, 159, 48.00, 'COMPLETED', 'CREDIT_CARD', 'pi_159_2026', '2026-01-24 17:05:00'),
(160, 10, 160, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_160_2026', '2026-01-24 18:05:00'),
(161, 11, 161, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_161_2026', '2026-01-24 19:05:00'),
(162, 12, 162, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_162_2026', '2026-01-24 20:05:00'),
(163, 13, 163, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_163_2026', '2026-01-24 21:05:00'),
(164, 14, 164, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_164_2026', '2026-01-24 22:05:00'),
(165, 15, 165, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_165_2026', '2026-01-24 23:05:00'),
(166, 16, 166, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_166_2026', '2026-01-25 00:05:00'),
(167, 17, 167, 54.00, 'COMPLETED', 'CREDIT_CARD', 'pi_167_2026', '2026-01-25 09:05:00'),
(168, 18, 168, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_168_2026', '2026-01-25 10:05:00'),
(169, 19, 169, 48.00, 'COMPLETED', 'CREDIT_CARD', 'pi_169_2026', '2026-01-25 11:05:00'),
(170, 20, 170, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_170_2026', '2026-01-25 12:05:00'),
(171, 21, 171, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_171_2026', '2026-01-25 13:05:00'),
(172, 22, 172, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_172_2026', '2026-01-25 14:05:00'),
(173, 23, 173, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_173_2026', '2026-01-25 15:05:00'),
(174, 24, 174, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_174_2026', '2026-01-25 16:05:00'),
(175, 25, 175, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_175_2026', '2026-01-25 17:05:00'),
(176, 26, 176, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_176_2026', '2026-01-25 18:05:00'),
(177, 27, 177, 54.00, 'COMPLETED', 'CREDIT_CARD', 'pi_177_2026', '2026-01-25 19:05:00'),
(178, 28, 178, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_178_2026', '2026-01-25 20:05:00'),
(179, 29, 179, 48.00, 'COMPLETED', 'CREDIT_CARD', 'pi_179_2026', '2026-01-25 21:05:00'),
(180, 30, 180, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_180_2026', '2026-01-25 22:05:00'),
(181, 1, 181, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_181_2026', '2026-01-26 23:05:00'),
(182, 2, 182, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_182_2026', '2026-01-26 00:05:00'),
(183, 3, 183, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_183_2026', '2026-01-26 09:05:00'),
(184, 4, 184, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_184_2026', '2026-01-26 10:05:00'),
(185, 5, 185, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_185_2026', '2026-01-26 11:05:00'),
(186, 6, 186, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_186_2026', '2026-01-26 12:05:00'),
(187, 7, 187, 54.00, 'COMPLETED', 'CREDIT_CARD', 'pi_187_2026', '2026-01-26 13:05:00'),
(188, 8, 188, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_188_2026', '2026-01-26 14:05:00'),
(189, 9, 189, 48.00, 'COMPLETED', 'CREDIT_CARD', 'pi_189_2026', '2026-01-26 15:05:00'),
(190, 10, 190, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_190_2026', '2026-01-26 16:05:00'),
(191, 11, 191, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_191_2026', '2026-01-26 17:05:00'),
(192, 12, 192, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_192_2026', '2026-01-26 18:05:00'),
(193, 13, 193, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_193_2026', '2026-01-26 19:05:00'),
(194, 14, 194, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_194_2026', '2026-01-26 20:05:00'),
(195, 15, 195, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_195_2026', '2026-01-26 21:05:00'),
(196, 16, 196, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_196_2026', '2026-01-27 22:05:00'),
(197, 17, 197, 54.00, 'COMPLETED', 'CREDIT_CARD', 'pi_197_2026', '2026-01-27 23:05:00'),
(198, 18, 198, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_198_2026', '2026-01-27 00:05:00'),
(199, 19, 199, 48.00, 'COMPLETED', 'CREDIT_CARD', 'pi_199_2026', '2026-01-27 09:05:00'),
(200, 20, 200, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_200_2026', '2026-01-27 10:05:00'),
(201, 21, 201, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_201_2026', '2026-01-27 11:05:00'),
(202, 22, 202, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_202_2026', '2026-01-27 12:05:00'),
(203, 23, 203, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_203_2026', '2026-01-27 13:05:00'),
(204, 24, 204, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_204_2026', '2026-01-27 14:05:00'),
(205, 25, 205, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_205_2026', '2026-01-27 15:05:00'),
(206, 26, 206, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_206_2026', '2026-01-27 16:05:00'),
(207, 27, 207, 54.00, 'COMPLETED', 'CREDIT_CARD', 'pi_207_2026', '2026-01-27 17:05:00'),
(208, 28, 208, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_208_2026', '2026-01-27 18:05:00'),
(209, 29, 209, 48.00, 'COMPLETED', 'CREDIT_CARD', 'pi_209_2026', '2026-01-27 19:05:00'),
(210, 30, 210, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_210_2026', '2026-01-27 20:05:00'),
(211, 1, 211, 45.00, 'COMPLETED', 'CREDIT_CARD', 'pi_211_2026', '2026-01-28 21:05:00'),
(212, 2, 212, 30.00, 'COMPLETED', 'CREDIT_CARD', 'pi_212_2026', '2026-01-28 22:05:00'),
(213, 3, 213, 65.00, 'COMPLETED', 'CREDIT_CARD', 'pi_213_2026', '2026-01-28 23:05:00'),
(214, 4, 214, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_214_2026', '2026-01-28 00:05:00'),
(215, 5, 215, 90.00, 'COMPLETED', 'CREDIT_CARD', 'pi_215_2026', '2026-01-28 09:05:00'),
(216, 6, 216, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_216_2026', '2026-01-28 10:05:00'),
(217, 7, 217, 54.00, 'COMPLETED', 'CREDIT_CARD', 'pi_217_2026', '2026-01-28 11:05:00'),
(218, 8, 218, 60.00, 'COMPLETED', 'CREDIT_CARD', 'pi_218_2026', '2026-01-28 12:05:00'),
(219, 9, 219, 48.00, 'COMPLETED', 'CREDIT_CARD', 'pi_219_2026', '2026-01-28 13:05:00'),
(220, 10, 220, 36.00, 'COMPLETED', 'CREDIT_CARD', 'pi_220_2026', '2026-01-28 14:05:00');


-- ========================================
-- ORDER ITEMS
-- ========================================

INSERT INTO order_items (id, order_id, ticket_type_id, quantity, price_per_ticket, is_valid) VALUES
-- Order 1 items (User 1, Event 1)
(1, 1, 1, 2, 25.00, TRUE),
(2, 1, 2, 1, 50.00, TRUE),

-- Order 2 items (User 1, Event 2)
(3, 2, 4, 2, 40.00, TRUE),
(4, 2, 6, 1, 15.00, TRUE),

-- Order 3 items (User 1, Event 5)
(5, 3, 12, 3, 20.00, TRUE),

-- Order 4 items (User 1, Event 9)
(6, 4, 22, 3, 40.00, TRUE),

-- Order 5 items (User 1, Event 15)
(7, 5, 36, 3, 35.00, TRUE),

-- Order 6 items (User 1, Event 21)
(8, 6, 48, 2, 60.00, TRUE),
(9, 6, 49, 1, 35.00, TRUE),

-- Order 7 items (User 1, Event 26)
(10, 7, 58, 2, 40.00, TRUE),
(11, 7, 59, 1, 150.00, TRUE),

-- Order 8 items (User 1, Event 32)
(12, 8, 70, 2, 90.00, TRUE),

-- Order 9 items (User 1, Event 39)
(13, 9, 84, 3, 28.00, TRUE),

-- Order 10 items (User 1, Event 46)
(14, 10, 98, 3, 80.00, TRUE),

-- Order 11 items (User 2, Event 1)
(15, 11, 2, 2, 50.00, TRUE),

-- Order 12 items (User 2, Event 4)
(16, 12, 9, 2, 80.00, TRUE),

-- Order 13 items (User 2, Event 11)
(17, 13, 27, 2, 40.00, TRUE),

-- Order 14 items (User 2, Event 16)
(18, 14, 38, 3, 45.00, TRUE),

-- Order 15 items (User 2, Event 22)
(19, 15, 50, 3, 30.00, TRUE),
(20, 15, 51, 1, 60.00, TRUE),

-- Order 16 items (User 2, Event 29)
(21, 16, 64, 3, 40.00, TRUE),

-- Order 17 items (User 2, Event 36)
(22, 17, 78, 4, 35.00, TRUE),

-- Order 18 items (User 2, Event 42)
(23, 18, 90, 3, 55.00, TRUE),

-- Order 19 items (User 3, Event 2)
(24, 19, 5, 2, 25.00, TRUE),
(25, 19, 6, 1, 15.00, TRUE),

-- Order 20 items (User 3, Event 7)
(26, 20, 17, 2, 30.00, TRUE),
(27, 20, 18, 1, 50.00, TRUE),

-- Order 21 items (User 3, Event 12)
(28, 21, 29, 3, 45.00, TRUE),

-- Order 22 items (User 3, Event 18)
(29, 22, 42, 4, 12.00, TRUE),
(30, 22, 43, 4, 15.00, TRUE),

-- Order 23 items (User 3, Event 25)
(31, 23, 56, 3, 15.00, TRUE),
(32, 23, 57, 1, 50.00, TRUE),

-- Order 24 items (User 3, Event 31)
(33, 24, 68, 3, 20.00, TRUE),
(34, 24, 69, 1, 50.00, TRUE),

-- Order 25 items (User 3, Event 37)
(35, 25, 80, 3, 35.00, TRUE),

-- Order 26 items (User 3, Event 43)
(36, 26, 92, 2, 120.00, TRUE),

-- Order 27 items (User 3, Event 47)
(37, 27, 100, 3, 28.00, TRUE),

-- Order 28 items (User 4, Event 3)
(38, 28, 7, 1, 20.00, TRUE),
(39, 28, 8, 2, 12.00, TRUE),

-- Order 29 items (User 4, Event 10)
(40, 29, 25, 3, 120.00, TRUE),

-- Order 30 items (User 4, Event 20)
(41, 30, 46, 3, 25.00, TRUE),

-- Order 31 items (User 4, Event 27)
(42, 31, 60, 3, 35.00, TRUE),

-- Order 32 items (User 4, Event 34)
(43, 32, 74, 3, 12.00, TRUE),

-- Order 33 items (User 4, Event 40)
(44, 33, 86, 1, 40.00, TRUE),

-- Order 34 items (User 4, Event 48)
(45, 34, 102, 3, 50.00, TRUE),

-- Order 35 items (User 5, Event 6)
(46, 35, 15, 2, 25.00, TRUE),

-- Order 36 items (User 5, Event 13)
(47, 36, 31, 1, 60.00, TRUE),
(48, 36, 33, 2, 20.00, TRUE),

-- Order 37 items (User 5, Event 19)
(49, 37, 44, 2, 150.00, TRUE),

-- Order 38 items (User 5, Event 23)
(50, 38, 52, 3, 25.00, TRUE),

-- Order 39 items (User 5, Event 30)
(51, 39, 67, 2, 30.00, TRUE),

-- Order 40 items (User 5, Event 35)
(52, 40, 76, 3, 150.00, TRUE),

-- Order 41 items (User 5, Event 41)
(53, 41, 88, 3, 22.00, TRUE),

-- Order 42 items (User 5, Event 45)
(54, 42, 96, 5, 10.00, TRUE),

-- Order 43-130 items (simplified - 2 items per order average)
(55, 43, 2, 1, 50.00, TRUE),
(56, 44, 20, 5, 25.00, TRUE),
(57, 45, 34, 2, 30.00, TRUE),
(58, 46, 54, 2, 80.00, TRUE),
(59, 47, 12, 2, 20.00, TRUE),
(60, 47, 13, 1, 35.00, TRUE),
(61, 48, 17, 2, 30.00, TRUE),
(62, 48, 18, 1, 50.00, TRUE),
(63, 49, 62, 2, 50.00, TRUE),
(64, 49, 63, 1, 80.00, TRUE),
(65, 50, 82, 2, 80.00, TRUE),

(66, 51, 22, 3, 40.00, TRUE),
(67, 52, 38, 2, 45.00, TRUE),
(68, 53, 72, 3, 25.00, TRUE),
(69, 54, 94, 3, 15.00, TRUE),

(70, 55, 27, 3, 40.00, TRUE),
(71, 56, 48, 2, 60.00, TRUE),
(72, 56, 49, 1, 35.00, TRUE),
(73, 57, 70, 1, 90.00, TRUE),
(74, 57, 71, 1, 40.00, TRUE),
(75, 58, 90, 2, 55.00, TRUE),

(76, 59, 36, 4, 35.00, TRUE),
(77, 60, 58, 2, 40.00, TRUE),
(78, 61, 84, 2, 28.00, TRUE),
(79, 62, 104, 3, 35.00, TRUE),

(80, 63, 9, 2, 80.00, TRUE),
(81, 63, 10, 1, 150.00, TRUE),
(82, 64, 42, 5, 12.00, TRUE),
(83, 65, 64, 4, 40.00, TRUE),
(84, 66, 92, 1, 120.00, TRUE),
(85, 66, 93, 1, 50.00, TRUE),

(86, 67, 17, 3, 30.00, TRUE),
(87, 67, 19, 2, 100.00, TRUE),
(88, 68, 50, 4, 30.00, TRUE),
(89, 69, 78, 5, 35.00, TRUE),
(90, 70, 98, 3, 80.00, TRUE),
(91, 70, 99, 1, 150.00, TRUE),

(92, 71, 29, 2, 45.00, TRUE),
(93, 72, 60, 2, 35.00, TRUE),
(94, 73, 86, 2, 40.00, TRUE),
(95, 74, 106, 4, 30.00, TRUE),

(96, 75, 31, 1, 60.00, TRUE),
(97, 75, 33, 2, 20.00, TRUE),
(98, 76, 56, 3, 15.00, TRUE),
(99, 76, 57, 1, 50.00, TRUE),
(100, 77, 80, 3, 35.00, TRUE),
(101, 77, 81, 1, 60.00, TRUE),
(102, 78, 102, 2, 50.00, TRUE),
(103, 78, 103, 1, 100.00, TRUE),

(104, 79, 44, 3, 150.00, TRUE),
(105, 80, 68, 4, 20.00, TRUE),
(106, 80, 69, 1, 50.00, TRUE),
(107, 81, 88, 4, 22.00, TRUE),
(108, 82, 100, 4, 28.00, TRUE),

(109, 83, 4, 2, 40.00, TRUE),
(110, 84, 52, 4, 25.00, TRUE),
(111, 85, 74, 4, 12.00, TRUE),

(112, 86, 25, 2, 120.00, TRUE),
(113, 87, 67, 3, 30.00, TRUE),
(114, 88, 96, 5, 10.00, TRUE),
(115, 88, 97, 1, 25.00, TRUE),

(116, 89, 34, 2, 30.00, TRUE),
(117, 89, 35, 1, 100.00, TRUE),
(118, 90, 62, 4, 50.00, TRUE),
(119, 91, 94, 4, 15.00, TRUE),

(120, 92, 46, 2, 25.00, TRUE),
(121, 93, 72, 4, 25.00, TRUE),
(122, 94, 104, 2, 35.00, TRUE),

(123, 95, 7, 3, 20.00, TRUE),
(124, 96, 54, 3, 80.00, TRUE),
(125, 97, 82, 3, 80.00, TRUE),

(126, 98, 15, 1, 25.00, TRUE),
(127, 98, 16, 1, 15.00, TRUE),
(128, 99, 76, 2, 150.00, TRUE),
(129, 100, 106, 5, 30.00, TRUE),

(130, 101, 17, 3, 30.00, TRUE),
(131, 101, 19, 2, 100.00, TRUE),
(132, 102, 58, 3, 40.00, TRUE),
(133, 103, 90, 3, 55.00, TRUE),

(134, 104, 20, 5, 25.00, TRUE),
(135, 105, 70, 2, 90.00, TRUE),
(136, 106, 98, 4, 80.00, TRUE),

(137, 107, 22, 3, 40.00, TRUE),
(138, 108, 64, 5, 40.00, TRUE),
(139, 109, 92, 1, 120.00, TRUE),
(140, 109, 93, 1, 50.00, TRUE),

(141, 110, 36, 5, 35.00, TRUE),
(142, 111, 78, 6, 35.00, TRUE),
(143, 112, 100, 5, 28.00, TRUE),

(144, 113, 27, 4, 40.00, TRUE),
(145, 114, 60, 3, 35.00, TRUE),
(146, 115, 86, 2, 40.00, TRUE),
(147, 115, 87, 1, 25.00, TRUE),
(148, 116, 102, 5, 50.00, TRUE),

(149, 117, 38, 3, 45.00, TRUE),
(150, 118, 68, 4, 20.00, TRUE),
(151, 118, 69, 2, 50.00, TRUE),
(152, 119, 84, 4, 28.00, TRUE),
(153, 120, 96, 10, 10.00, TRUE),

(154, 121, 44, 2, 150.00, TRUE),
(155, 121, 45, 1, 90.00, TRUE),
(156, 122, 80, 3, 35.00, TRUE),
(157, 122, 81, 1, 60.00, TRUE),
(158, 123, 94, 5, 15.00, TRUE),

(159, 124, 48, 3, 60.00, TRUE),
(160, 124, 49, 1, 35.00, TRUE),
(161, 125, 72, 6, 25.00, TRUE),
(162, 126, 88, 5, 22.00, TRUE),

(163, 127, 50, 5, 30.00, TRUE),
(164, 128, 74, 5, 12.00, TRUE),
(165, 129, 90, 4, 55.00, TRUE),
(166, 130, 106, 6, 30.00, TRUE);

-- ========================================
-- ORDER ITEMS FOR UPCOMING ORDERS
-- ========================================

INSERT INTO order_items (id, order_id, ticket_type_id, quantity, price_per_ticket, is_valid) VALUES
-- Order 131 (Event 51, ticket 109 Single 18)
(167, 131, 109, 2, 18.00, TRUE),

-- Order 132 (Event 52, ticket 110 Marathon Pass 70)
(168, 132, 110, 1, 70.00, TRUE),

-- Order 133 (Event 53, tickets 112 Opening 25, 113 General 15)
(169, 133, 112, 1, 25.00, TRUE),
(170, 133, 113, 2, 15.00, TRUE),

-- Order 134 (Event 54, tickets 114 Conf 200, 115 Workshop Only 80)
(171, 134, 114, 1, 200.00, TRUE),
(172, 134, 115, 1, 80.00, TRUE),

-- Order 135 (Event 55, ticket 116 Show 25)
(173, 135, 116, 3, 25.00, TRUE),

-- Order 136 (Event 56, ticket 119 Family Pack 120)
(174, 136, 119, 1, 120.00, TRUE),

-- Order 137 (Event 57, tickets 120 Theater 30, 121 Premium 55)
(175, 137, 120, 1, 30.00, TRUE),
(176, 137, 121, 1, 55.00, TRUE),

-- Order 138 (Event 58, tickets 123 Upper 25, 122 Lower 45)
(177, 138, 123, 2, 25.00, TRUE),
(178, 138, 122, 1, 45.00, TRUE),

-- Order 139 (Event 59, tickets 124 Workshop 130, 125 Observer 45)
(179, 139, 124, 1, 130.00, TRUE),
(180, 139, 125, 1, 45.00, TRUE),

-- Order 140 (Event 60, ticket 126 Party Entry 20)
(181, 140, 126, 2, 20.00, TRUE),

-- Order 141 (Event 61, tickets 128 Entry 30, 129 Premium 50)
(182, 141, 128, 2, 30.00, TRUE),
(183, 141, 129, 1, 50.00, TRUE),

-- Order 142 (Event 62, tickets 130 Wine Pairing 60, 131 Premium Tasting 100)
(184, 142, 130, 1, 60.00, TRUE),
(185, 142, 131, 1, 100.00, TRUE),

-- Order 143 (Event 63, tickets 132 Orchestra 70, 133 Balcony 40)
(186, 143, 132, 2, 70.00, TRUE),
(187, 143, 133, 1, 40.00, TRUE),

-- Order 144 (Event 64, tickets 134 Investor 50, 135 Startup 30)
(188, 144, 134, 1, 50.00, TRUE),
(189, 144, 135, 1, 30.00, TRUE),

-- Order 145 (Event 65, tickets 136 Beach Party 35, 137 VIP Cabana 150)
(190, 145, 136, 1, 35.00, TRUE),
(191, 145, 137, 1, 150.00, TRUE),

-- Order 146 (Event 66, ticket 138 Rock Fest 40)
(192, 146, 138, 2, 40.00, TRUE),

-- Order 147 (Event 67, tickets 140 Dance Show 35, 141 Premium 60)
(193, 147, 140, 1, 35.00, TRUE),
(194, 147, 141, 1, 60.00, TRUE),

-- Order 148 (Event 68, tickets 142 Film Week 60, 143 Single Film 15)
(195, 148, 142, 1, 60.00, TRUE),
(196, 148, 143, 1, 15.00, TRUE),

-- Order 149 (Event 69, tickets 144 Conference 180, 145 Single Day 100)
(197, 149, 144, 1, 180.00, TRUE),
(198, 149, 145, 1, 100.00, TRUE),

-- Order 150 (Event 70, tickets 146 Tournament 20, 147 Spectator 8)
(199, 150, 146, 2, 20.00, TRUE),
(200, 150, 147, 2, 8.00, TRUE);

-- ========================================
-- REVIEWS FOR PAST EVENTS (ENGLISH ONLY)
-- ========================================

INSERT INTO reviews (id, user_id, event_id, rating, comment, created_at, updated_at) VALUES
-- Event 1 reviews
(1, 1, 1, 5, 'Incredible concert! The atmosphere was magical!', '2025-01-02 10:00:00', '2025-01-02 10:00:00'),
(2, 2, 1, 5, 'Best New Year ever! Amazing rock concert!', '2025-01-02 11:00:00', '2025-01-02 11:00:00'),
(3, 6, 1, 4, 'Very well organized with excellent music!', '2025-01-03 12:00:00', '2025-01-03 12:00:00'),

-- Event 2 reviews
(4, 1, 2, 4, 'Wonderful classical music in an elegant venue!', '2025-01-03 14:00:00', '2025-01-03 14:00:00'),
(5, 3, 2, 5, 'The orchestra was fantastic! A magical evening!', '2025-01-03 15:00:00', '2025-01-03 15:00:00'),
(6, 16, 2, 4, 'Great acoustics and a wonderful performance!', '2025-01-04 10:00:00', '2025-01-04 10:00:00'),

-- Event 4 reviews
(7, 2, 4, 5, 'Excellent conference with so much new knowledge!', '2025-01-11 10:00:00', '2025-01-11 10:00:00'),
(8, 11, 4, 5, 'Top speakers and great networking opportunities!', '2025-01-11 11:00:00', '2025-01-11 11:00:00'),
(9, 20, 4, 4, 'Very informative and well organized event!', '2025-01-12 12:00:00', '2025-01-12 12:00:00'),

-- Event 5 reviews
(10, 1, 5, 5, 'I laughed until I cried! Amazing comedians!', '2025-01-13 10:00:00', '2025-01-13 10:00:00'),
(11, 7, 5, 4, 'Very good show, totally worth the money!', '2025-01-13 11:00:00', '2025-01-13 11:00:00'),

-- Event 6 reviews
(12, 5, 6, 5, 'Perfect Valentine party with a romantic atmosphere!', '2025-02-15 10:00:00', '2025-02-15 10:00:00'),
(13, 21, 6, 5, 'Perfectly organized event for couples!', '2025-02-15 11:00:00', '2025-02-15 11:00:00'),

-- Event 7 reviews
(14, 3, 7, 5, 'A moving event for Independence Day!', '2025-03-26 10:00:00', '2025-03-26 10:00:00'),
(15, 12, 7, 5, 'Wonderful patriotic concert!', '2025-03-26 11:00:00', '2025-03-26 11:00:00'),

-- Event 9 reviews
(16, 1, 9, 5, 'Incredible game! Best finale ever!', '2025-03-16 10:00:00', '2025-03-16 10:00:00'),
(17, 8, 9, 4, 'Great game with an intense atmosphere!', '2025-03-16 11:00:00', '2025-03-16 11:00:00'),
(18, 24, 9, 5, 'The best basketball night of the year!', '2025-03-17 12:00:00', '2025-03-17 12:00:00'),

-- Event 11 reviews
(19, 2, 11, 4, 'Three days full of jazz! Loved it!', '2025-04-20 10:00:00', '2025-04-20 10:00:00'),
(20, 9, 11, 5, 'The best jazz artists in one festival!', '2025-04-20 11:00:00', '2025-04-20 11:00:00'),

-- Event 12 reviews
(21, 3, 12, 5, 'An excellent tasting experience!', '2025-04-23 10:00:00', '2025-04-23 10:00:00'),
(22, 13, 12, 4, 'Very good wines and an interesting event!', '2025-04-23 11:00:00', '2025-04-23 11:00:00'),

-- Event 13 reviews
(23, 5, 13, 5, 'La Traviata was stunning! Bravo!', '2025-04-26 10:00:00', '2025-04-26 10:00:00'),
(24, 14, 13, 5, 'A breathtaking opera performance!', '2025-04-26 11:00:00', '2025-04-26 11:00:00'),

-- Event 15 reviews
(25, 1, 15, 5, '12 hours of non-stop music! Unforgettable!', '2025-05-01 10:00:00', '2025-05-01 10:00:00'),
(26, 10, 15, 4, 'Amazing party, all DJs were top-notch!', '2025-05-01 11:00:00', '2025-05-01 11:00:00'),

-- Event 16 reviews
(27, 2, 16, 4, 'Good rock festival with solid organization!', '2025-05-02 10:00:00', '2025-05-02 10:00:00'),
(28, 8, 16, 5, 'The best outdoor festival of the spring!', '2025-05-02 11:00:00', '2025-05-02 11:00:00'),

-- Event 18 reviews
(29, 3, 18, 5, 'Wonderful Greek films! Loved it!', '2025-05-11 10:00:00', '2025-05-11 10:00:00'),
(30, 11, 18, 4, 'A very good film selection!', '2025-05-11 11:00:00', '2025-05-11 11:00:00'),

-- Event 19 reviews
(31, 5, 19, 5, 'Excellent conference with many takeaways!', '2025-05-16 10:00:00', '2025-05-16 10:00:00'),
(32, 15, 19, 5, 'Top digital marketing insights!', '2025-05-16 11:00:00', '2025-05-16 11:00:00'),
(33, 28, 19, 4, 'Very interesting, I will attend again next year!', '2025-05-17 12:00:00', '2025-05-17 12:00:00'),

-- Event 21 reviews
(34, 1, 21, 5, '24 hours of non-stop music! Epic!', '2025-06-22 10:00:00', '2025-06-22 10:00:00'),
(35, 9, 21, 5, 'The best summer solstice festival!', '2025-06-22 11:00:00', '2025-06-22 11:00:00'),
(36, 29, 21, 4, 'Great vibes and an amazing atmosphere!', '2025-06-23 12:00:00', '2025-06-23 12:00:00'),

-- Event 22 reviews
(37, 2, 22, 5, 'Non-stop laughter! Amazing comedians!', '2025-06-16 10:00:00', '2025-06-16 10:00:00'),
(38, 22, 22, 4, 'Very good comedy tour!', '2025-06-16 11:00:00', '2025-06-16 11:00:00'),

-- Event 23 reviews
(39, 5, 23, 5, 'Medea under the stars! Magical experience!', '2025-06-11 10:00:00', '2025-06-11 10:00:00'),
(40, 16, 23, 5, 'A powerful ancient theater performance!', '2025-06-11 11:00:00', '2025-06-11 11:00:00'),

-- Event 26 reviews
(41, 1, 26, 5, 'Best beach party ever! Full moon magic!', '2025-07-11 10:00:00', '2025-07-11 10:00:00'),
(42, 10, 26, 5, 'Unforgettable Mykonos night!', '2025-07-11 11:00:00', '2025-07-11 11:00:00'),
(43, 22, 26, 4, 'Amazing party, I will definitely come again!', '2025-07-12 12:00:00', '2025-07-12 12:00:00'),

-- Event 27 reviews
(44, 4, 27, 5, 'Excellent classical guitar recital!', '2025-07-16 10:00:00', '2025-07-16 10:00:00'),
(45, 13, 27, 4, 'Very good performance in a beautiful venue!', '2025-07-16 11:00:00', '2025-07-16 11:00:00'),

-- Event 29 reviews
(46, 2, 29, 5, 'The best hip hop festival in Greece!', '2025-07-26 10:00:00', '2025-07-26 10:00:00'),
(47, 11, 29, 5, 'All my favorite Greek rappers! Amazing!', '2025-07-26 11:00:00', '2025-07-26 11:00:00'),
(48, 24, 29, 4, 'Very well organized event!', '2025-07-27 12:00:00', '2025-07-27 12:00:00'),

-- Event 31 reviews
(49, 3, 31, 4, 'Amazing street food festival!', '2025-08-02 10:00:00', '2025-08-02 10:00:00'),
(50, 27, 31, 5, 'I tried everything! Delicious!', '2025-08-02 11:00:00', '2025-08-02 11:00:00'),

-- Event 32 reviews
(51, 1, 32, 5, 'Three-day beach party! Perfect!', '2025-08-12 10:00:00', '2025-08-12 10:00:00'),
(52, 9, 32, 4, 'Great electronic music and a beautiful beach!', '2025-08-12 11:00:00', '2025-08-12 11:00:00'),
(53, 23, 32, 5, 'The best beach festival of the year!', '2025-08-13 12:00:00', '2025-08-13 12:00:00'),

-- Event 33 reviews
(54, 8, 33, 5, 'Beautiful traditional music!', '2025-08-16 10:00:00', '2025-08-16 10:00:00'),
(55, 19, 33, 4, 'Very good folk music event!', '2025-08-16 11:00:00', '2025-08-16 11:00:00'),

-- Event 36 reviews
(56, 2, 36, 5, 'Excellent films with international quality!', '2025-09-06 10:00:00', '2025-09-06 10:00:00'),
(57, 12, 36, 5, 'The best film festival in Greece!', '2025-09-06 11:00:00', '2025-09-06 11:00:00'),
(58, 25, 36, 4, 'Very good film selection!', '2025-09-07 12:00:00', '2025-09-07 12:00:00'),

-- Event 37 reviews
(59, 3, 37, 5, 'Perfect harvest festival! Traditional and fun!', '2025-09-16 10:00:00', '2025-09-16 10:00:00'),
(60, 14, 37, 4, 'Great wine and great atmosphere!', '2025-09-16 11:00:00', '2025-09-16 11:00:00'),
(61, 28, 37, 5, 'Wonderful experience, I will come again!', '2025-09-17 12:00:00', '2025-09-17 12:00:00'),

-- Event 39 reviews
(62, 1, 39, 5, 'Authentic rebetiko music! Loved it!', '2025-09-26 10:00:00', '2025-09-26 10:00:00'),
(63, 10, 39, 4, 'Very talented musicians and a great atmosphere!', '2025-09-26 11:00:00', '2025-09-26 11:00:00'),

-- Event 40 reviews
(64, 4, 40, 5, 'An unforgettable experience on a historic route!', '2025-09-29 10:00:00', '2025-09-29 10:00:00'),
(65, 13, 40, 5, 'Best marathon ever with perfect organization!', '2025-09-29 11:00:00', '2025-09-29 11:00:00'),
(66, 26, 40, 4, 'Excellent organization, I will run again next year!', '2025-09-30 12:00:00', '2025-09-30 12:00:00'),

-- Event 41 reviews
(67, 5, 41, 5, 'Scary and entertaining! Perfect Halloween!', '2025-11-01 10:00:00', '2025-11-01 10:00:00'),
(68, 15, 41, 4, 'Very good horror theater experience!', '2025-11-01 11:00:00', '2025-11-01 11:00:00'),

-- Event 42 reviews
(69, 2, 42, 5, 'World-class jazz performances!', '2025-11-11 10:00:00', '2025-11-11 10:00:00'),
(70, 9, 42, 5, 'The best jazz festival in Greece!', '2025-11-11 11:00:00', '2025-11-11 11:00:00'),
(71, 22, 42, 4, 'Excellent artists and performances!', '2025-11-12 12:00:00', '2025-11-12 12:00:00'),

-- Event 43 reviews
(72, 3, 43, 5, 'Very inspiring event for startups!', '2025-11-21 10:00:00', '2025-11-21 10:00:00'),
(73, 11, 43, 5, 'Great networking and valuable insights!', '2025-11-21 11:00:00', '2025-11-21 11:00:00'),
(74, 24, 43, 4, 'Excellent speakers and workshops!', '2025-11-22 12:00:00', '2025-11-22 12:00:00'),

-- Event 44 reviews
(75, 8, 44, 5, 'Magical light installations!', '2025-12-02 10:00:00', '2025-12-02 10:00:00'),
(76, 18, 44, 4, 'Beautiful light installations!', '2025-12-02 11:00:00', '2025-12-02 11:00:00'),
(77, 28, 44, 5, 'Perfect place for photos!', '2025-12-03 12:00:00', '2025-12-03 12:00:00'),

-- Event 45 reviews
(78, 5, 45, 4, 'Lovely Christmas market!', '2025-12-06 10:00:00', '2025-12-06 10:00:00'),
(79, 21, 45, 5, 'Festive atmosphere and beautiful crafts!', '2025-12-06 11:00:00', '2025-12-06 11:00:00'),

-- Event 46 reviews
(80, 1, 46, 5, 'Magical New Year concert!', '2026-01-01 10:00:00', '2026-01-01 10:00:00'),
(81, 12, 46, 5, 'Best New Year celebration! Bravo!', '2026-01-01 11:00:00', '2026-01-01 11:00:00'),
(82, 23, 46, 5, 'Wonderful orchestra and a perfect gala!', '2026-01-02 12:00:00', '2026-01-02 12:00:00'),

-- Event 47 reviews
(83, 3, 47, 5, 'I laughed so much! Perfect Christmas special!', '2025-12-21 10:00:00', '2025-12-21 10:00:00'),
(84, 15, 47, 4, 'Very good comedians!', '2025-12-21 11:00:00', '2025-12-21 11:00:00'),
(85, 25, 47, 5, 'Hilarious show, perfect for the holidays!', '2025-12-22 12:00:00', '2025-12-22 12:00:00'),

-- Event 48 reviews
(86, 4, 48, 4, 'Inspiring winter sports celebration!', '2025-12-16 10:00:00', '2025-12-16 10:00:00'),
(87, 14, 48, 5, 'Perfect gala for winter sports!', '2025-12-16 11:00:00', '2025-12-16 11:00:00'),
(88, 26, 48, 4, 'Great event and well organized!', '2025-12-17 12:00:00', '2025-12-17 12:00:00'),

-- Event 49 reviews
(89, 10, 49, 5, 'Beautiful chamber music performance!', '2025-12-11 10:00:00', '2025-12-11 10:00:00'),
(90, 19, 49, 4, 'Wonderful classical performance!', '2025-12-11 11:00:00', '2025-12-11 11:00:00'),

-- Event 50 reviews
(91, 3, 50, 5, '100 years of Greek theater! Very moving!', '2025-12-19 10:00:00', '2025-12-19 10:00:00'),
(92, 21, 50, 5, 'Amazing retrospective with so much history!', '2025-12-19 11:00:00', '2025-12-19 11:00:00'),
(93, 30, 50, 4, 'Very interesting tribute to theater!', '2025-12-20 12:00:00', '2025-12-20 12:00:00');


-- Reset auto-increment counters
ALTER TABLE roles AUTO_INCREMENT = 4;
ALTER TABLE categories AUTO_INCREMENT = 11;
ALTER TABLE venues AUTO_INCREMENT = 31;
ALTER TABLE users AUTO_INCREMENT = 51;
ALTER TABLE events AUTO_INCREMENT = 121;
ALTER TABLE ticket_types AUTO_INCREMENT = 246;
ALTER TABLE orders AUTO_INCREMENT = 221;
ALTER TABLE payments AUTO_INCREMENT = 221;
ALTER TABLE order_items AUTO_INCREMENT = 237;
ALTER TABLE reviews AUTO_INCREMENT = 94;