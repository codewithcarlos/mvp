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

app.get("/", function (req, res) {});

app.get("/card", (req, res) => {
  getMagicCard((data) => {
    const { name, imageUrl, multiverseid } = data.card;
    db.insertCard([name, imageUrl, multiverseid], (err, result) => {
      if (err) {
        return res.status(404).send("error inserting card into the db");
      }
      res.status(200).send(data);
    });
  });
});

app.get("/name", (req, res) => {
  findCardByName("Dark Confidant", (data) => {
    let firstValidCard;
    for (let i = 0; i < data.length; i++) {
      if (data[i].multiverseid) {
        firstValidCard = data[i];
        break;
      }
    }
    res.status(200).send(firstValidCard);
  });
});

app.get("/deck", (req, res) => {
  db.getDeck(req.query.importedDeck, (err, data) => {
    if (err) {
      return res.status(404).send(`error getting deck. ${err}`);
    }
    res.status(200).send(data);
  });
});

app.post("/deck", (req, res) => {

  const { queryString } = req.body;
  db.getPostedDeck(queryString, (err, data) => {
    if (err) {
      return res.status(404).send(`error getting posted deck. ${err}`);
    }
    res.status(200).send(data);
  });
});

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname, "../public/index.html"), function(err) {
    if (err) {
      res.status(500).send(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
