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

-- INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (1, 'sam_a', 'Sam', 'A', 'sam@email.com', 'password1', 0);
-- INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (2, 'eric_d', 'Eric', 'D', 'eric_d@email.com', 'password2', 1);
-- INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (3, 'eric_h', 'Eric', 'H', 'eric@email.com', 'password3', 0);
-- INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (4, 'kiefer_t', 'Kiefer', 'T', 'keifer@email.com', 'password4', 1);
-- INSERT INTO `BBY_37_user` (`user_id`, `username`, `first_name`, `last_name`, `email_address`, `password`, `role_id`) VALUES (5, 'will_w', 'Will', 'W', 'will@email.com', 'password5', 0);


CREATE TABLE IF NOT EXISTS `BBY_37_location` (
  `location_id` int(16) NOT NULL AUTO_INCREMENT,
  `address` varchar(50) NOT NULL,
  `street` varchar(100) NOT NULL,
  `city` varchar(100) NOT NULL,
  `postal_code` varchar(100) NOT NULL,
  `type` varchar(100) NOT NULL,
  PRIMARY KEY (`location_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;

-- INSERT INTO `BBY_37_location` (`location_id`, `address`, `street`, `city`, `postal_code`, `type`) VALUES (1, '920', 'W 14th Ave', 'Vancouver', 'V5Z 1R4', 'apartment');
INSERT INTO `BBY_37_location` (`location_id`, `address`, `street`, `city`, `postal_code`, `type`) VALUES (2, '125', 'W 10th Ave', 'Vancouver', 'V5Y 1R7', 'apartment');
INSERT INTO `BBY_37_location` (`location_id`, `address`, `street`, `city`, `postal_code`, `type`) VALUES (3, '2200', 'Douglas Rd', 'Burnaby', 'V5C 5A7', 'apartment');
INSERT INTO `BBY_37_location` (`location_id`, `address`, `street`, `city`, `postal_code`, `type`) VALUES (4, '16686', '31 Ave', 'Surrey', 'V3S 9V1', 'condo');
INSERT INTO `BBY_37_location` (`location_id`, `address`, `street`, `city`, `postal_code`, `type`) VALUES (5, '9566', 'Tomicki Ave', 'Richmond', 'V6X 2M4', 'house');


CREATE TABLE IF NOT EXISTS `BBY_37_post` (
  `post_id` int(16) NOT NULL AUTO_INCREMENT,
  `user_id` int(16) NOT NULL,
  `title` varchar(100) NOT NULL,
  `date` DATE NOT NULL,
  `time` TIME NOT NULL,
  `content` varchar(100) NOT NULL,
  `location_id` int(16) NOT NULL,
  PRIMARY KEY (`post_id`),
  FOREIGN KEY(user_id) REFERENCES BBY_37_user(user_id),
  FOREIGN KEY(location_id) REFERENCES BBY_37_location(location_id)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8;