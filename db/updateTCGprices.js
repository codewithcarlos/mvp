const { TCG_TOKEN, TCG_COOKIE } = require("../config");
const axios = require("axios");
const VERSION = "v1.37.0";
const END_COUNT = 50308;
const INCREMENT = 250;
let k = 1;
const { db } = require("../db/index");

const getProductHeaders = {
  url: "https://api.tcgplayer.com/v1.32.0/catalog/products/158250",
  method: "GET",
  timeout: 0,
  headers: {
    Authorization: TCG_TOKEN,
    Cookie: TCG_COOKIE,
  },
};

const updatePrice = (p) => {
  const queryStr = `
  SELECT tcg_prod_id FROM card 
  WHERE id >= ${p} and id <= ${p + INCREMENT - 1} 
  AND tcg_prod_id IS NOT NULL`;

  db.query(queryStr, async (err, data) => {
    if (err) {
      console.error("problem selecting tcg_prod_ids from card db");
      return;
    }

    let prodIds = "";
    data.forEach((card) => {
      prodIds += card.tcg_prod_id + ",";
    });

    getProductHeaders.url = `http://api.tcgplayer.com/${VERSION}/pricing/product/${prodIds}`;
    const response = await axios(getProductHeaders);
    const prices = response.data.results;

    const recurse = (n) => {
      let marketPrice, midPrice;
      for (let i = n; i < n + 2; i++) {
        const cardMarketPrice = prices[i].marketPrice;
        const cardMidPrice = prices[i].midPrice;
        if (!marketPrice) {
          marketPrice = cardMarketPrice;
          midPrice = cardMidPrice;
        } else {
          if (cardMarketPrice && cardMarketPrice < marketPrice) {
            marketPrice = cardMarketPrice;
            midPrice = cardMidPrice;
          }
        }
      }
      const queryStr = `UPDATE card 
      SET marketPrice = ${marketPrice}, midPrice = ${midPrice} 
      WHERE tcg_prod_id = ${prices[n].productId}`;

      db.query(queryStr, (err, data) => {
        if (err) {
          console.error("error updating card price", n, prices[i].productId);
          return;
        }

        n += 2;
        if (n < prices.length) {
          recurse(n);
        } else {
          console.log("k is :", k);
          k += INCREMENT;
          if (k < END_COUNT) {
            updatePrice(k);
          } else {
            console.log("finished running script");
            return;
          }
        }
      });
    };
    recurse(0);
  });
};
updatePrice(k);
