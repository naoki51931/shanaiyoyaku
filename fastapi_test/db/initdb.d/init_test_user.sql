INSERT INTO user (user_name,password,kanji_name,kata_name,position,is_superuser,is_approval,is_active,author,created_at,updated_at)
VALUES ("naoki0121", "$2a$08$bAg3gnJ1s5DXiJAug5teE.TkX8UAAVUWITIyzROO65JZPXpy83xTK",
        "naoki ueda", "naoki ueda", "C", True, 2, True, "system_init",
        "2025-01-17 15:50:00", "2025-01-17 15:50:00");

INSERT INTO user (user_name,password,kanji_name,kata_name,position,is_superuser,is_approval,is_active,author,created_at,updated_at)
VALUES ("kanda0121", "passwordps", "naoki kanda", "naoki kanda", "C", False, 2, True, "system_init",
        "2025-01-17 15:50:00", "2025-01-17 15:50:00");

INSERT INTO office (office_name,office_id) VALUES ("京都駅前事務所"," O-01");
INSERT INTO office (office_name,office_id) VALUES ("四条大宮​事務所"," O-02");
INSERT INTO office (office_name,office_id) VALUES ("三条烏丸出張所"," O-03");
INSERT INTO office (office_name,office_id) VALUES ("高円寺事務所"," O-04");
INSERT INTO office (office_name,office_id) VALUES ("大阪​事務所"," O-05");
INSERT INTO office (office_name,office_id) VALUES ("浜大津事務所"," O-06");
INSERT INTO office (office_name,office_id) VALUES ("​大津駅前出張所"," O-07");

INSERT INTO seat_regist (seat_name,office_id) VALUES ("SA-01", 1);
INSERT INTO pasokon (pasokon_name,in_active,office_id,seat_id,performance) VALUES ("P-01", 2, 1, 1,"性能");

INSERT INTO seat_reservation (reserve_id,todo_content,person_id,office_id,seat_id,pasokon_id,start_time,finish_time,reserve_day)
VALUES (111, "comment", 1, 1, 1,1, "2025-05-30 10:45", "2025-05-31 10:45", "2025-05-30 10:45");

INSERT INTO tags (name) VALUES ("エクセル");
INSERT INTO tags (name) VALUES ("ワード");
INSERT INTO tags (name) VALUES ("Photoshop");
INSERT INTO tags (name) VALUES ("Illustrator");
INSERT INTO tags (name) VALUES ("CLIP STUDIO PAINT");
INSERT INTO tags (name) VALUES ("Premiere Pro");

