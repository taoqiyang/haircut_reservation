/*
 Navicat Premium Data Transfer

 Source Server         : Localhost
 Source Server Type    : MySQL
 Source Server Version : 50717
 Source Host           : localhost
 Source Database       : cAuth

 Target Server Type    : MySQL
 Target Server Version : 50717
 File Encoding         : utf-8

 Date: 08/10/2017 22:22:52 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `cSessionInfo`
-- ----------------------------
DROP TABLE IF EXISTS `cSessionInfo`;
CREATE TABLE `cSessionInfo` (
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `uuid` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `skey` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_visit_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `session_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_info` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`open_id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `skey` (`skey`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='会话管理用户信息';



DROP TABLE IF EXISTS `cUser`;
CREATE TABLE `cUser` (
  `id` bigint(20) AUTO_INCREMENT NOT NULL,
  `open_id` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `nike_name` varchar(30) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gender` int(2) DEFAULT 1,
  `country` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_detail` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `lat` DECIMAL(22,10) DEFAULT NULL,
  `lng` DECIMAL(22,10) DEFAULT NULL,
  `avatar_url` varchar(300) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `admin` int(2) DEFAULT 0,

  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `openid` (`open_id`) USING BTREE,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户';


DROP TABLE IF EXISTS `cReservation`;
CREATE TABLE `cReservation` (
  `id` bigint(20) AUTO_INCREMENT NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `user_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone_number` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `message` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `province` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_detail` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `lat` DECIMAL(22,10) NOT NULL,
  `lng` DECIMAL(22,10) NOT NULL,
  `reservation_time` timestamp NULL,
  `service_type` int(2) DEFAULT NULL,
  `service_type_desc` varchar(20) DEFAULT NULL,
  `status` int(2) DEFAULT 0 NOT NULL,
  `status_desc` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `reputation` int(2) DEFAULT NULL,
  `remark` varchar(100) DEFAULT NULL,
  `cancel_time` timestamp NULL,
  `deny_time` timestamp NULL,
  `deny_user_id` bigint(20) DEFAULT NULL,
  `deny_reason` varchar(100) DEFAULT NULL,
  `accept_time` timestamp NULL,
  `accept_user_id` bigint(20) DEFAULT NULL,
  `service_start_time` timestamp NULL,
  `service_user_id` bigint(20) DEFAULT NULL,
  `finish_time` timestamp NULL,
  `finish_user_id` bigint(20) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_update_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `valid` int(2) DEFAULT 1 NOT NULL,
  `service_target` int(2) DEFAULT NULL,
  `service_target_desc` varchar(20) DEFAULT NULL,
  `service_cost` int(5) DEFAULT NULL,

  PRIMARY KEY (`id`),
  FOREIGN KEY(`user_id`) references `cUser`(`id`),
  FOREIGN KEY(`deny_user_id`) references `cUser`(`id`),
  FOREIGN KEY(`accept_user_id`) references `cUser`(`id`),
  KEY `user_id` (`user_id`) USING BTREE,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户预约';

-- state:预约中1, 已接单2,已取消4,拒绝接单7,处理中9,已完成10,已过期11

SET FOREIGN_KEY_CHECKS = 1;

DROP TABLE IF EXISTS `cLoginLog`;
CREATE TABLE `cLoginLog` (
  `id` bigint(20) AUTO_INCREMENT NOT NULL,
  `user_id` bigint(20) NOT NULL,
  `mark` varchar(100) DEFAULT NULL,
  `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='简单登录记录';

