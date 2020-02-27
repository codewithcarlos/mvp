const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const PORT = 8080;
const db = require("../db/index");
const path = require("path");
const cors = require("cors");
const { getMagicCard, findCardByName } = require("../api/mtgAPI.js");

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "..", "public")));
console.log(path.join(__dirname, "..", "build"));

app.get("/", function(req, res) {
  console.log(req);
});

app.get("/card", (req, res) => {
  console.log("listings", req.body);
  getMagicCard(data => {
    const { name, imageUrl, multiverseid } = data.card;
    db.insertCard([name, imageUrl, multiverseid], (err, result) => {
      if (err) {
        return res.status(404).send("error inserting card into the db");
      }
      console.log("sql data", data);
      res.status(200).send(data);
    });
  });
});

app.get("/name", (req, res) => {
  console.log("name triggered");
  findCardByName("Dark Confidant", data => {
    let firstValidCard;
    for (let i = 0; i < data.length; i++) {
      console.log("multiversid is:", data[i].multiverseid);
      if (data[i].multiverseid) {
        firstValidCard = data[i];
        break;
      }
    }
    res.status(200).send(firstValidCard);
  });
});

app.get("/deck", (req, res) => {
  db.getDeck(req.query.mainDeck, (err, data) => {
    if (err) {
      console.log("error getting deck", err);
      return res.status(404).send("error getting deck");
    }
    res.status(200).send(data);
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
