const { TCG_TOKEN, TCG_COOKIE } = require("../config");
const axios = require("axios");
const VERSION = "v1.37.0";
const { db } = require("./index");
let i = 1;
const END_COUNT = 49386;

const raw = {
  sort: "MinPrice ASC",
  limit: 100,
  offset: 0,
  filters: [
    { name: "ProductName", values: ["Jace, the Mind Sculptor"] },
    { name: "SetName", values: ["Gift Boxes and Promos"] },
  ],
};

var settings = {
  url: "https://api.tcgplayer.com/v1.37.0/catalog/categories/1/search",
  method: "POST",
  timeout: 0,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: TCG_TOKEN,
    Cookie: TCG_COOKIE,
  },
  data: JSON.stringify(raw),
};

const getProductHeaders = {
  url: "https://api.tcgplayer.com/v1.32.0/catalog/products/158250",
  method: "GET",
  timeout: 0,
  headers: {
    Authorization: TCG_TOKEN,
    Cookie: TCG_COOKIE,
  },
};

const populate = (n) => {
  db.query(
    `SELECT name, set_lookup FROM cards2 WHERE id = ${n}`,
    (err, data) => {
      if (err) {
        console.log("error getting card", n);
      }
      let productId, setName, marketPrice, midPrice, tcg_imageUrl;

      //Remove accents/diacritics from card name to enable product search
      const cardName = data[0].name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      setName = data[0].set_lookup;
      raw.filters[0].values = [cardName];
      raw.filters[1].values = [setName];
      settings.data = JSON.stringify(raw);
      axios(settings)
        .then((response) => {
          // console.log("result of name and set search", response.data.results);
          if (response.data.results.length > 1) throw "More than 1 product Id";
          productId = response.data.results.join(",");
          if (productId === "") {
            throw "Product not in tcg database";
          }
          // get prices of the card
          getProductHeaders.url = `http://api.tcgplayer.com/${VERSION}/pricing/product/${productId}`;
          return axios(getProductHeaders);
        })
        .then((res) => {
          const results = res.data.results;
          // technically the below code is not ideal as it sometimes gives the foil price instead of normal price. However, the issue is fixed in the updateTCGprices process where the prices of all the cards are updated. And that script will be ran every day, so I decided not to change the code below.
          for (let i = 0; i < results.length; i++) {
            if (
              results[i].marketPrice !== null &&
              results[i].midPrice !== null
            ) {
              marketPrice = results[i].marketPrice;
              midPrice = results[i].midPrice;
              productId = results[i].productId;
              break;
            }
          }
          // get tcg_imageUrl
          getProductHeaders.url = `https://api.tcgplayer.com/v1.32.0/catalog/products/${productId}`;
          return axios(getProductHeaders);
        })
        .then((res) => {
          tcg_imageUrl = res.data.results[0]["imageUrl"];
          const params = [marketPrice, midPrice, tcg_imageUrl, productId];
          const queryStr = `UPDATE cards2 SET marketPrice = ?, midPrice = ?, tcg_imageUrl = ?, tcg_prod_id = ? WHERE id = ${n};`;
          db.query(queryStr, params, (err, data) => {
            if (err) {
              console.log("error inserting card into cards2", n, params);
              throw err;
            }
            console.log(n, cardName);
            n++;
            if (n < END_COUNT) {
              setTimeout(() => populate(n), 100);
            } else {
              console.log("finished");
              return;
            }
          });
        })
        .catch((err) => {
          console.log("error", n, cardName, err);
          db.query(
            `INSERT INTO card_errors VALUES(?, ?, ?)`,
            [n, cardName, err],
            (err, data) => {
              if (err) {
                console.log("error inserting card with error", n, cardName);
                console.log("node has stopped running");
                return;
              }

              n++;
              if (n < END_COUNT) {
                setTimeout(() => populate(n), 100);
              } else {
                console.log("finished");
                return;
              }
            }
          );
        });
    }
  );
};
populate(i);
