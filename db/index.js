const mysql = require("mysql");
const mtg = require("mtgsdk");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: `password`,
  database: "mtg",
  // database: "reactivities",
  charset: "utf8mb4",
});

db.connect();

function insertCard(params, callback) {
  const queryStr = `INSERT INTO cards 
  (name, imageUrl, multiverseid, manaCost, cmc, types) 
  VALUES (?, ?, ?, ?, ?, ?);`;
  db.query(queryStr, params, (err, data) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, data);
    }
  });
}

function getDeck(deck, callback) {
  // console.log("initial deck is:\n", deck);
  const deckWithImageInfo = [];
  const recurse = (index) => {
    let queryString = `SELECT * FROM cards WHERE name = ?`;
    const card = deck[index];
    db.query(queryString, card, (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        // console.log(`deck is ${deck} and index is ${index}`);
        if (data[0] === undefined) {
          // console.log("card and index", card, index);
          mtg.card
            .where({ name: card.indexOf("'") !== -1 ? card : `"${card}"` })
            .then((data) => {
              if (data.length === 0) {
                // console.log('card does not exist or was spelt incorrectly');
                throw `The card ${card} does not exist or was spelt incorrectly`;
              }
              const result = handleFoundCard(data);
              // console.log("mtgcard", card, result[0]);
              return result;
            })
            .then((result) => {
              // console.log("result of handleFoundCard", result, deck, index);
              insertCard(result, (err, data) => {
                if (err) {
                  console.log("error inserting card");
                  callback(err, null);
                } else {
                  db.query(queryString, result[0], (err, data) => {
                    if (err) {
                      console.log("card does not exist");
                      callback(err, null);
                    } else {
                      deckWithImageInfo.push(data[0]);
                      if (index === deck.length - 1) {
                        // console.log(deckWithImageInfo);
                        callback(null, deckWithImageInfo);
                      } else {
                        recurse(index + 1);
                      }
                    }
                  });
                }
              });
            })
            .catch((err) => {
              console.log(err);
              recurse(index + 1);
              // callback(err, null);
            });
        } else {
          // console.log("data not undefined", index, data[0][0]);
          deckWithImageInfo.push(data[0]);
          if (index === deck.length - 1) {
            // console.log(deckWithImageInfo);
            callback(null, deckWithImageInfo);
          } else {
            recurse(index + 1);
          }
        }
      }
    });
  };
  recurse(0);
}

const handleFoundCard = (data) => {
  let firstValidCard;
  let multiverseid;
  for (let i = 0; i < data.length; i++) {
    if (data[i].multiverseid) {
      firstValidCard = data[i];
      break;
    }
  }
  if (!firstValidCard) {
    firstValidCard = data[0];
    multiverseid = -1;
  } else {
    multiverseid = firstValidCard.multiverseid;
  }
  let { name, imageUrl, manaCost, cmc, types } = firstValidCard;
  if (imageUrl === undefined) {
    // console.log("image not found for card", name);
    imageUrl = "";
  }
  types = types.join(",");
  const result = [name, imageUrl, multiverseid, manaCost, cmc, types];
  // console.log("handle found card:", result);
  return result;
};

function getPostedDeck(queryStr, callback) {
  const queryString = `
  SELECT     
    id,
    name,
    manaCost,
    cmc,
    types,
    CASE WHEN imageUrl is null THEN tcg_imageUrl ELSE imageUrl END AS imageUrl,
    marketPrice,
    midPrice  
  FROM min_market_prices
  WHERE name in ${queryStr}`;

  db.query(queryString, (err, data) => {
    if (err) {
      callback(err, null);
    }
    callback(null, data);
  });
}

module.exports = {
  db,
  insertCard,
  getDeck,
  handleFoundCard,
  getPostedDeck,
};
