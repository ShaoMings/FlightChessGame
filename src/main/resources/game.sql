/*
 Navicat Premium Data Transfer

 Source Server         : mysql
 Source Server Type    : MySQL
 Source Server Version : 50732
 Source Host           : localhost:3306
 Source Schema         : game

 Target Server Type    : MySQL
 Target Server Version : 50732
 File Encoding         : 65001

 Date: 04/08/2021 17:23:48
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(12) COLLATE utf8_bin NOT NULL,
  `username` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `password` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `gender` char(1) COLLATE utf8_bin DEFAULT NULL,
  `role` varchar(5) COLLATE utf8_bin DEFAULT NULL,
  PRIMARY KEY (`id`,`user_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ----------------------------
-- Records of user
-- ----------------------------
BEGIN;
INSERT INTO `user` VALUES (2, '201821096025', '刘定一', '12345', '男', '普通用户');
INSERT INTO `user` VALUES (3, '201821096022', '杨金杰', '12345', '女', '普通用户');
INSERT INTO `user` VALUES (4, '201821096008', '邵明', '12345', '男', '超级管理员');
INSERT INTO `user` VALUES (7, '201821096007', 'User201821096007', '12345', '男', '普通用户');
INSERT INTO `user` VALUES (8, '201821096122', 'User201821096122', '12345', '女', '普通用户');
INSERT INTO `user` VALUES (9, '201821096066', '武永辉', '12345', NULL, '普通用户');
COMMIT;

SET FOREIGN_KEY_CHECKS = 1;
