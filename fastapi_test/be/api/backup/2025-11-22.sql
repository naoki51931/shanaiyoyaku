/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19-11.8.3-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: db    Database: sample_db
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*M!100616 SET @OLD_NOTE_VERBOSITY=@@NOTE_VERBOSITY, NOTE_VERBOSITY=0 */;

--
-- Table structure for table `office`
--

DROP TABLE IF EXISTS `office`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `office` (
  `id` int NOT NULL AUTO_INCREMENT,
  `office_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `office_id` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `office_name` (`office_name`),
  UNIQUE KEY `office_id` (`office_id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `office`
--

LOCK TABLES `office` WRITE;
/*!40000 ALTER TABLE `office` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `office` VALUES
(1,'京都駅前事務所',' O-01','2025-11-21 05:48:41','2025-11-22 02:27:04'),
(2,'四条大宮​事務所',' O-02','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(3,'三条烏丸出張所',' O-03','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(4,'高円寺事務所',' O-04','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(5,'大阪​事務所',' O-05','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(6,'浜大津事務所',' O-06','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(7,'​大津駅前出張所',' O-07','2025-11-21 05:48:41','2025-11-21 05:48:41');
/*!40000 ALTER TABLE `office` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `pasokon`
--

DROP TABLE IF EXISTS `pasokon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pasokon` (
  `id` int NOT NULL AUTO_INCREMENT,
  `pasokon_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `in_active` int DEFAULT '1',
  `office_id` int NOT NULL,
  `seat_id` int NOT NULL,
  `performance` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `pasokon_name` (`pasokon_name`),
  KEY `office_id` (`office_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `pasokon_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `office` (`id`),
  CONSTRAINT `pasokon_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seat_regist` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pasokon`
--

LOCK TABLES `pasokon` WRITE;
/*!40000 ALTER TABLE `pasokon` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `pasokon` VALUES
(1,'P-01',2,1,1,'性能','2025-11-21 05:48:41','2025-11-21 05:48:41');
/*!40000 ALTER TABLE `pasokon` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `pasokon_tags`
--

DROP TABLE IF EXISTS `pasokon_tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `pasokon_tags` (
  `pasokon_id` int NOT NULL,
  `tag_id` int NOT NULL,
  PRIMARY KEY (`pasokon_id`,`tag_id`),
  KEY `tag_id` (`tag_id`),
  CONSTRAINT `pasokon_tags_ibfk_1` FOREIGN KEY (`pasokon_id`) REFERENCES `pasokon` (`id`) ON DELETE CASCADE,
  CONSTRAINT `pasokon_tags_ibfk_2` FOREIGN KEY (`tag_id`) REFERENCES `tags` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pasokon_tags`
--

LOCK TABLES `pasokon_tags` WRITE;
/*!40000 ALTER TABLE `pasokon_tags` DISABLE KEYS */;
set autocommit=0;
/*!40000 ALTER TABLE `pasokon_tags` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `seat_regist`
--

DROP TABLE IF EXISTS `seat_regist`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_regist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `seat_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `office_id` int DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `seat_name` (`seat_name`),
  KEY `office_id` (`office_id`),
  CONSTRAINT `seat_regist_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `office` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_regist`
--

LOCK TABLES `seat_regist` WRITE;
/*!40000 ALTER TABLE `seat_regist` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `seat_regist` VALUES
(1,'SA-01',1,'2025-11-21 05:48:41','2025-11-21 05:48:41');
/*!40000 ALTER TABLE `seat_regist` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `seat_reservation`
--

DROP TABLE IF EXISTS `seat_reservation`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `seat_reservation` (
  `id` int NOT NULL AUTO_INCREMENT,
  `reserve_id` int NOT NULL,
  `todo_content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `person_id` int NOT NULL,
  `office_id` int NOT NULL,
  `seat_id` int NOT NULL,
  `pasokon_id` int NOT NULL,
  `start_time` datetime NOT NULL,
  `finish_time` datetime NOT NULL,
  `reserve_day` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `person_id` (`person_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `seat_reservation_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `user` (`id`),
  CONSTRAINT `seat_reservation_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seat_regist` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_reservation`
--

LOCK TABLES `seat_reservation` WRITE;
/*!40000 ALTER TABLE `seat_reservation` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `seat_reservation` VALUES
(1,111,'comment',1,1,1,1,'2025-05-30 10:45:00','2025-05-31 10:45:00','2025-05-30 10:45:00','2025-11-21 05:48:41','2025-11-21 05:48:41');
/*!40000 ALTER TABLE `seat_reservation` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `tags`
--

DROP TABLE IF EXISTS `tags`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `tags` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tags`
--

LOCK TABLES `tags` WRITE;
/*!40000 ALTER TABLE `tags` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `tags` VALUES
(1,'エクセル','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(2,'ワード','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(3,'Photoshop','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(4,'Illustrator','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(5,'CLIP STUDIO PAINT','2025-11-21 05:48:41','2025-11-21 05:48:41'),
(6,'Premiere Pro','2025-11-21 05:48:41','2025-11-21 05:48:41');
/*!40000 ALTER TABLE `tags` ENABLE KEYS */;
UNLOCK TABLES;
commit;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `kanji_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `kata_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `author` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `is_approval` int NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `user_name` (`user_name`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `user` VALUES
(1,'naoki0121','$2a$08$bAg3gnJ1s5DXiJAug5teE.TkX8UAAVUWITIyzROO65JZPXpy83xTK','naoki ueda','naoki ueda',NULL,'C',1,2,1,'2025-01-17 15:50:00','2025-01-17 15:50:00'),
(2,'kanda0121','$2b$12$4LIn2PURqinpjiJpAp1ijOPdNGid8ZMxdPcJ7Z54hdl509O1zY9Tm','naoki kanda','naoki kanda',NULL,'C',0,2,1,'2025-01-17 15:50:00','2025-11-21 07:46:38');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
commit;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*M!100616 SET NOTE_VERBOSITY=@OLD_NOTE_VERBOSITY */;

-- Dump completed on 2025-11-22  2:27:30
