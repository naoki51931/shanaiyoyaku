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
  `pasokon_id` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pasokon_name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `in_active` int DEFAULT '1',
  `office_id` int NOT NULL,
  `seat_id` int NOT NULL,
  `performance` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `office_id` (`office_id`),
  KEY `seat_id` (`seat_id`),
  CONSTRAINT `pasokon_ibfk_1` FOREIGN KEY (`office_id`) REFERENCES `office` (`id`),
  CONSTRAINT `pasokon_ibfk_2` FOREIGN KEY (`seat_id`) REFERENCES `seat_regist` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `pasokon`
--

LOCK TABLES `pasokon` WRITE;
/*!40000 ALTER TABLE `pasokon` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `pasokon` VALUES
(2,NULL,'P-02',2,1,2,'テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。テストで性能を表示します。','2025-11-24 05:28:03','2025-11-25 01:33:27'),
(3,NULL,'VAIO',2,1,2,'CPU 	インテル Core 5 120U\n1.4GHz/10コア	画面サイズ 	14 型(インチ)\n画面種類	IPS液晶	解像度 	WUXGA (1920x1200)\nリフレッシュレート	　	アスペクト比	16：10\nワイド画面 	○	タッチパネル	　\n2in1タイプ 	　	表面処理	ノングレア(非光沢)\nメモリ容量 	標準16GB	メモリ規格	DDR5 PC5-41600\nメモリスロット（空き）	　	ストレージ容量 	M.2 SSD：512GB\nビデオチップ	Intel Graphics	ビデオメモリ	　\nNPU	　	 	 \n詳細スペック\nOS	Windows 11 Home	Office詳細 	Office無し\n駆動時間	　	セルフ交換バッテリー	　\nインターフェース	HDMIx1\nUSB3.2 Gen1x2\nUSB3.2 Gen2 Type-Cx1\nSDスロット	USB PD	○\nドライブ規格 	　	その他	Webカメラ\nBluetooth\n日本語キーボード\nゲーミングPC	　	生体認証	　\nインテル Evoプラットフォーム	　	ファンレス	　\nBTO対応	○	 	 \nネットワーク\n無線LAN	IEEE802.11a/b/g/n/ac/ax	Wi-Fi Direct対応 	　\nNFC 	　	LAN	　\nSIMフリー対応	　	SIMカード	　\nサイズ･重量\n重量	1.54 kg	幅x高さx奥行	314x19.9x226.15 mm\nエコマーク\nエコマーク 	　	認定番号	　\nカラー\nカラー	プラチナシルバー	 	 \n各種ベンチマーク\nPassMark\n(CPUスコア) 	16365	CrossMark\n(CPUスコア) 	1688\n3DMark\n(TimeSpyスコア) 	　	 	 ','2025-11-25 04:45:43','2025-11-25 04:45:43'),
(8,'P-02','VAIO',2,1,3,'CPU 	インテル Core 5 120U\n1.4GHz/10コア	画面サイズ 	14 型(インチ)\n画面種類	IPS液晶	解像度 	WUXGA (1920x1200)\nリフレッシュレート	　	アスペクト比	16：10\nワイド画面 	○	タッチパネル	　\n2in1タイプ 	　	表面処理	ノングレア(非光沢)\nメモリ容量 	標準16GB	メモリ規格	DDR5 PC5-41600\nメモリスロット（空き）	　	ストレージ容量 	M.2 SSD：512GB\nビデオチップ	Intel Graphics	ビデオメモリ	　\nNPU	　	 	 \n詳細スペック\nOS	Windows 11 Home	Office詳細 	Office無し\n駆動時間	　	セルフ交換バッテリー	　\nインターフェース	HDMIx1\nUSB3.2 Gen1x2\nUSB3.2 Gen2 Type-Cx1\nSDスロット	USB PD	○\nドライブ規格 	　	その他	Webカメラ\nBluetooth\n日本語キーボード\nゲーミングPC	　	生体認証	　\nインテル Evoプラットフォーム	　	ファンレス	　\nBTO対応	○	 	 \nネットワーク\n無線LAN	IEEE802.11a/b/g/n/ac/ax	Wi-Fi Direct対応 	　\nNFC 	　	LAN	　\nSIMフリー対応	　	SIMカード	　\nサイズ･重量\n重量	1.54 kg	幅x高さx奥行	314x19.9x226.15 mm\nエコマーク\nエコマーク 	　	認定番号	　\nカラー\nカラー	プラチナシルバー	 	 \n各種ベンチマーク\nPassMark\n(CPUスコア) 	16365	CrossMark\n(CPUスコア) 	1688\n3DMark\n(TimeSpyスコア) 	　	 	 ','2025-11-25 05:06:39','2025-11-25 05:06:39');
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
INSERT INTO `pasokon_tags` VALUES
(2,1),
(3,1),
(8,1),
(2,2),
(3,2),
(8,2);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seat_regist`
--

LOCK TABLES `seat_regist` WRITE;
/*!40000 ALTER TABLE `seat_regist` DISABLE KEYS */;
set autocommit=0;
INSERT INTO `seat_regist` VALUES
(2,'SA-02',1,'2025-11-24 05:20:11','2025-11-24 05:20:11'),
(3,'SA-03',1,'2025-11-25 05:00:32','2025-11-25 05:00:32');
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

