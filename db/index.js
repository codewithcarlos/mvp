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
  const queryStr = `INSERT INTO cards (name, imageUrl, multiverseid) VALUES (?, ?, ?);`;
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
              // console.log(
              //   `mtg card: deck is ${deck} and index is ${index}`,
              //   data
              // );
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
                  // console.log(
                  //   "query the same card again",
                  //   deck,
                  //   index,
                  //   result[0]
                  // );
                  db.query(queryString, result[0], (err, data) => {
                    if (err) {
                      console.log("card does not exist");
                      callback(err, null);
                    } else {
                      // console.log(
                      //   "card exists",
                      //   data,
                      //   deck,
                      //   index,
                      //   deck.length - 1
                      // );
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
  // deck.forEach((card, index) => {

  // });
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
  let { name, imageUrl } = firstValidCard;
  if (imageUrl === undefined) {
    console.log("image not found for card", name);
    imageUrl = "";
  }
  // console.log("handle found card:", name, imageUrl, multiverseid);
  return [name, imageUrl, multiverseid];
};

module.exports = {
  db,
  insertCard,
  getDeck,
};
