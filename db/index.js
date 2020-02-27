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

module.exports = {
  db,
  insertCard
};
