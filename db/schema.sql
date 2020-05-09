-- DROP DATABASE IF EXISTS mtg;

-- CREATE DATABASE mtg;

USE mtg;

CREATE TABLE cards (
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  manaCost VARCHAR(50),
  cmc INT NOT NULL,
  colorIdentity VARCHAR(5),
  types VARCHAR(70) NOT NULL,
  rarity VARCHAR(15),
  setCode VARCHAR(10),
  setName VARCHAR(255),
  multiverseid INT,
  imageUrl TEXT
);


CREATE TABLE tcg_set_names (
  setName VARCHAR(100) NOT NULL,
  tcg_setName VARCHAR(100),
  tcg_set_lookup VARCHAR(100)
);


CREATE TABLE cards2_unique (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY) 
SELECT DISTINCT
	name,
	manaCost,
	cmc,
	colorIdentity,
	types,
	rarity,
	setCode,
	setName,
	multiverseid,
	imageUrl
FROM cards
ORDER BY name;

CREATE TABLE cards2 
SELECT 
  a.*,
(SELECT tcg_set_lookup FROM tcg_set_names WHERE setName = a.setName) AS set_lookup
FROM cards2_unique a;

ALTER TABLE cards2
ADD COLUMN marketPrice DECIMAL(8,2) DEFAULT NULL,
ADD COLUMN midPrice DECIMAL(8,2) DEFAULT NULL,
ADD COLUMN tcg_imageUrl TEXT,
ADD COLUMN tcg_prod_id INT(10) unsigned DEFAULT NULL,
ADD COLUMN tcg_card_name VARCHAR(255) DEFAULT NULL;


CREATE TABLE card_errors (
id INT,
name VARCHAR(255),
description TEXT
);
CREATE INDEX id_idx ON card_errors(id);

CREATE TABLE card_errors2 (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY)
SELECT DISTINCT
	a.name, 
	b.set_lookup
FROM card_errors a inner join cards2 b
	on a.id = b.id
where a.description = 'More than 1 product Id';

CREATE TABLE `multiple_cards` (
`id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
`name` varchar(255) NOT NULL,
`manaCost` varchar(50) DEFAULT NULL,
`cmc` int(11) NOT NULL,
`colorIdentity` varchar(5) DEFAULT NULL,
`types` varchar(70) NOT NULL,
`rarity` varchar(15) DEFAULT NULL,
`setCode` varchar(10) DEFAULT NULL,
`setName` varchar(255) DEFAULT NULL,
`multiverseid` int(11) DEFAULT NULL,
`imageUrl` text,
`set_lookup` varchar(100) DEFAULT NULL,
`marketPrice` decimal(8,2) DEFAULT NULL,
`midPrice` decimal(8,2) DEFAULT NULL,
`tcg_imageUrl` text,
`tcg_prod_id` int(10) unsigned DEFAULT NULL,
`tcg_card_name` varchar(255) DEFAULT NULL
);


CREATE TABLE card (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY)
SELECT name, manaCost, cmc, colorIdentity, types, rarity, setCode, setName, multiverseid, imageUrl, set_lookup, marketPrice, midPrice, tcg_imageUrl, tcg_prod_id, tcg_card_name 
FROM cards2 
WHERE id NOT IN (SELECT id FROM card_errors WHERE description = 'More than 1 product Id')
UNION 
SELECT name, manaCost, cmc, colorIdentity, types, rarity, setCode, setName, multiverseid, imageUrl, set_lookup, marketPrice, midPrice, tcg_imageUrl, tcg_prod_id, tcg_card_name 
FROM multiple_cards
ORDER BY name;