const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: `password`,
  database: "mtg",
  charset: "utf8mb4"
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
  const deckWithImageInfo = [];
  deck.forEach((card, index) => {
    let queryString = `SELECT * FROM cards WHERE name = ?`;
    db.query(queryString, card, (err, data) => {
      if (err) {
        // console.log(data);
        callback(err, null);
      } else {
        // console.log(data);
        deckWithImageInfo.push(data[0]);
      }
      if (index === deck.length - 1) {
        // console.log(deckWithImageInfo);
        callback(null, deckWithImageInfo);
      }
    });
  });
}

module.exports = {
  db,
  insertCard,
  getDeck
};
