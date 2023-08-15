CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE deans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE reservation (
    id INT AUTO_INCREMENT PRIMARY KEY,
    deans_id VARCHAR(255),
    student_id VARCHAR(255),
    date DATE NOT NULL,
    time TIME NOT NULL,
    reserved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (deans_id) REFERENCES deans(username),
    FOREIGN KEY (student_id) REFERENCES students(username)
);

CREATE TABLE session (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userid VARCHAR(255),
    token VARCHAR(255) NOT NULL,
    expire_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `deans` (`id`, `name`, `username`, `password`) VALUES (NULL, 'Dean A', 'd01', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO `deans` (`id`, `name`, `username`, `password`) VALUES (NULL, 'Dean B', 'd02', '5f4dcc3b5aa765d61d8327deb882cf99');

INSERT INTO `students` (`id`, `name`, `username`, `password`) VALUES (NULL, 'Student A', 's01', '5f4dcc3b5aa765d61d8327deb882cf99');
INSERT INTO `students` (`id`, `name`, `username`, `password`) VALUES (NULL, 'Student B', 's02', '5f4dcc3b5aa765d61d8327deb882cf99');
