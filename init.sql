-- init.sql
-- Create databases
CREATE DATABASE IF NOT EXISTS ticket_db;
CREATE DATABASE IF NOT EXISTS user_db;
CREATE DATABASE IF NOT EXISTS analytics_db;
CREATE DATABASE IF NOT EXISTS logging_db;

-- Create users for each service
CREATE USER IF NOT EXISTS 'ticket_user'@'%' IDENTIFIED BY 'ticket_pass';
CREATE USER IF NOT EXISTS 'user_user'@'%' IDENTIFIED BY 'user_pass';
CREATE USER IF NOT EXISTS 'analytics_user'@'%' IDENTIFIED BY 'analytics_pass';
CREATE USER IF NOT EXISTS 'logging_user'@'%' IDENTIFIED BY 'logging_pass';

-- Grant privileges (each user can only access their own database)
GRANT ALL PRIVILEGES ON ticket_db.* TO 'ticket_user'@'%';
GRANT ALL PRIVILEGES ON user_db.* TO 'user_user'@'%';
GRANT ALL PRIVILEGES ON analytics_db.* TO 'analytics_user'@'%';
GRANT ALL PRIVILEGES ON logging_db.* TO 'logging_user'@'%';

-- Root can access everything (already has access)
-- FLUSH privileges to apply changes
FLUSH PRIVILEGES;

-- Optional: Create some initial tables if needed
-- USE ticket_db;
-- CREATE TABLE IF NOT EXISTS tickets (id INT AUTO_INCREMENT PRIMARY KEY, ...);