-- Create a table ordered by lowest market price and mid price. Make num the primary key. 
SET @row_number = 0; 

DROP TABLE IF EXISTS mp1;
CREATE TABLE mp1
SELECT 
  (@row_number:=@row_number + 1) AS num, 
  a.* 
FROM card a
WHERE marketPrice IS NOT NULL
AND set_lookup != 'World Championship Decks'
ORDER BY name, marketPrice, midPrice;

ALTER TABLE mp1
ADD PRIMARY KEY (num);


-- For each card, select the version with the min market price. Make minNum the primary key.
DROP TABLE IF EXISTS mp2;
CREATE TABLE mp2
SELECT
  name,
  min(num) as minNum
FROM mp1
GROUP BY name;

ALTER TABLE mp2
ADD PRIMARY KEY (minNum);

-- Finally create the min market prices table which has all the information needed to display the Deck Page component. Add an index to name field for efficient querying.
DROP TABLE IF EXISTS min_market_prices;
CREATE TABLE min_market_prices
SELECT
  a.*
FROM mp1 a inner join mp2 b
	on a.num = b.minNum;
    
CREATE INDEX name_idx ON min_market_prices(name);
