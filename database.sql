CREATE DATABASE IF NOT EXISTS `COMP2800` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `COMP2800`;

CREATE TABLE IF NOT EXISTS `BBY_37_user` (
  `user_id` int(16) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email_address` varchar(100) NOT NULL,
  `password` varchar(100) NOT NULL,
  `role_id` int(2) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (1, 'sam_a', 'Sam', 'A', 'sam@email.com', 'password1', 0);
INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (2, 'eric_d', 'Eric', 'D', 'eric_d@email.com', 'password2', 1);
INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (3, 'eric_h', 'Eric', 'H', 'eric@email.com', 'password3', 0);
INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (4, 'kiefer_t', 'Kiefer', 'T', 'keifer@email.com', 'password4', 1);
INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (5, 'will_w', 'Will', 'W', 'will@email.com', 'password5', 0);