CREATE DATABASE koto2_nodejs;

USE koto2_nodejs;

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    login VARCHAR(255),
    password VARCHAR(255)
);

CREATE TABLE publications(
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    text TEXT,
    creator INT,
    category INT,
    upload_file TEXT,
    FOREIGN KEY (creator) REFERENCES users(id)
);

CREATE TABLE subscriptions(
    id INT AUTO_INCREMENT PRIMARY KEY,
    subscribed_to INT,
    subscriber INT,
    FOREIGN KEY (subscribed_to) REFERENCES users(id),
    FOREIGN KEY (subscriber) REFERENCES users(id)
);

CREATE TABLE likes(
    id INT AUTO_INCREMENT PRIMARY KEY,
    liker INT,
    liked INT,
    FOREIGN KEY (liker) REFERENCES users(id),
    FOREIGN KEY (liked) REFERENCES publications(id)
);

CREATE TABLE feedbacks(
    id INT AUTO_INCREMENT PRIMARY KEY,
    creator INT,
    theme VARCHAR(255),
    text TEXT,
    email VARCHAR(255),
    reason VARCHAR(255),
    rate INT
);




SELECT 
    subscribed_to
FROM subscriptions
WHERE WHERE id = 1
JOIN 
    publications
ON 
    subscriptions.subscribed_to = publications.creator
ORDER BY publications.id DESC