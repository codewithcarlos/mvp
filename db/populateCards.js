const axios = require("axios");
const { db } = require("../db/index");
let page = 1;
const LAST_PAGE = 516;

var populate = () => {
  axios
    .get(`http://api.magicthegathering.io/v1/cards?page=${page}`)
    .then(({ data }) => {
      const { cards } = data;
      const recurse = (n) => {
        if (n >= cards.length) {
          return;
        }
        const card = cards[n];
        let types = card.types;
        types = types.join(",");
        let colorIdentity = card.colorIdentity;
        colorIdentity = colorIdentity.join("");
        const setCode = card.set;
        const params = [
          card.name,
          card.manaCost,
          card.cmc,
          colorIdentity,
          types,
          card.rarity,
          setCode,
          card.setName,
          card.multiverseid,
          card.imageUrl,
        ];
        const queryStr = `INSERT INTO cards
        (name, manaCost, cmc, colorIdentity, types, rarity, setCode, setName, multiverseid, imageUrl)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
        db.query(queryStr, params, (err) => {
          if (err) {
            console.log(`Error. failed on page ${page}, card ${n}`);
          }
          n++;
          recurse(n);
        });
      };
      recurse(0);
      page++;
      console.log(page);
      if (page < LAST_PAGE) {
        populate();
      } else {
        console.log("finished", page);
        return;
      }
    });
};
populate();
