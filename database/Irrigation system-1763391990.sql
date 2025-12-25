CREATE TABLE IF NOT EXISTS `sensors` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`SensorName` varchar(50) NOT NULL,
	`Val_avg` float NOT NULL,
	`date` date NOT NULL,
	`Pot_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `pots` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`Strains_id` int NOT NULL,
	`date` date NOT NULL,
	`name` varchar(50) NOT NULL,
	`status` boolean NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `irrigation_system` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`date` date NOT NULL,
	`time` time NOT NULL,
	`count` int NOT NULL,
	`pot_id` int NOT NULL,
	PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `strains` (
	`id` int AUTO_INCREMENT NOT NULL UNIQUE,
	`type` varchar(50) NOT NULL,
	`Instructions_list` varchar(1000) NOT NULL,
	PRIMARY KEY (`id`)
);

ALTER TABLE `sensors` ADD CONSTRAINT `sensors_fk4` FOREIGN KEY (`pot_id`) REFERENCES `pots`(`id`);
ALTER TABLE `pots` ADD CONSTRAINT `pots_fk1` FOREIGN KEY (`strains_id`) REFERENCES `strains`(`id`);
ALTER TABLE `irrigation_system` ADD CONSTRAINT `irrigation_system_fk4` FOREIGN KEY (`pot_id`) REFERENCES `pots`(`id`);
