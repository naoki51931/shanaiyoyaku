CREATE TABLE `user` (
    id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(30) UNIQUE NOT NULL,
    password VARCHAR(128) NOT NULL,
    kanji_name VARCHAR(30) NOT NULL,
    kata_name VARCHAR(30) NOT NULL,
    position VARCHAR(20) NOT NULL,
    is_superuser BOOLEAN NOT NULL,
    is_approval INT NOT NULL,
    is_active BOOLEAN NOT NULL,
    author VARCHAR(30) NOT NULL DEFAULT 'author',  -- ★ 追加
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE `office` (
    id INT NOT NULL AUTO_INCREMENT,
    office_name VARCHAR(30) UNIQUE NOT NULL,
    office_id VARCHAR(30) UNIQUE NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE `seat_regist` (
    id INT NOT NULL AUTO_INCREMENT,
    seat_name VARCHAR(30) UNIQUE NOT NULL,
    office_id INT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (office_id) REFERENCES office(id),
    PRIMARY KEY (id)
);

CREATE TABLE tags (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE `pasokon` (
    id INT NOT NULL AUTO_INCREMENT,
    pasokon_name VARCHAR(30) UNIQUE NOT NULL,
    in_active INT DEFAULT 1,
    office_id INT NOT NULL,
    seat_id INT NOT NULL,
    performance TEXT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (office_id) REFERENCES office(id),
    FOREIGN KEY (seat_id) REFERENCES seat_regist(id),
    PRIMARY KEY (id)
);


CREATE TABLE `seat_reservation` (
    id INT NOT NULL AUTO_INCREMENT,
    reserve_id INT NOT NULL,
    todo_content TEXT NULL,
    person_id INT NOT NULL,
    office_id INT NOT NULL,
    seat_id INT NOT NULL,
    pasokon_id INT NOT NULL,
    start_time DATETIME NOT NULL,
    finish_time DATETIME NOT NULL,
    reserve_day DATETIME NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (person_id) REFERENCES user(id),
    FOREIGN KEY (seat_id) REFERENCES seat_regist(id),
    PRIMARY KEY (id)
);

CREATE TABLE pasokon_tags (
    pasokon_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (pasokon_id, tag_id),
    FOREIGN KEY (pasokon_id) REFERENCES pasokon(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

