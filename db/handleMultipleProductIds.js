const { TCG_TOKEN, TCG_COOKIE } = require("../config");
const axios = require("axios");
const VERSION = "v1.37.0";
const END_COUNT = 3010;
let i = 1;
const { db } = require("../db/index");

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

const recurse = (n) => {
  db.query(
    `SELECT name, set_lookup FROM card_errors2 WHERE id = ${n}`,
    (err, data) => {
      if (err) {
        console.log("error getting card", n);
      }

      let productId,
        setName,
        groupId = "",
        cardProducts,
        marketPrice,
        midPrice,
        tcg_imageUrl;

      //Remove accents/diacritics from card name to enable product search
      const cardName = data[0].name
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      setName = data[0].set_lookup;

      if (setName === "World Championship Decks") {
        console.log(n, cardName);
        n++;
        return recurse(n);
      }

      raw.filters[0].values = [cardName];
      raw.filters[1].values = [setName];
      settings.data = JSON.stringify(raw);
      axios(settings)
        .then((response) => {
          // console.log("result of name and set search", response.data.results);
          productId = response.data.results.join(",");
          getProductHeaders.url = `https://api.tcgplayer.com/${VERSION}/catalog/products/${productId}`;
          return axios(getProductHeaders);
        })
        .then(async (res) => {
          cardProducts = res.data.results;
          // console.log("product info", cardProducts);

          /*******************************************************************************************************
                                        CONDITION A     
 Check if all cards in cardProducts have exact name matches. Because TCG Player's API does its search based on if a query parameter contains the phrase you inputted, as opposed to a strict equality search, this sometimes causes more data to come back than desired. 
 
 For example, a search for Acidic Slime with setName equal to "Commander Anthology" returns results for both the "Commander Anthology" version and the "Commander Anthology Volume II" version. Since we only want the former card in this scenario, we need extra logic to handle this. The code in the CONDITION A block was written to handle these kinds of scenarios. ******************************************************************************************************/

          const allNamesHaveExactMatch = cardProducts.every(
            (card) => card.name === cardName
          );
          const allNamesStartWith = cardProducts.every((card) =>
            card.name.startsWith(cardName)
          );

          if (allNamesHaveExactMatch) {
            /*******************************************************************************************************
             *  CONDITION A        Find the card with the correct set name via groupId request                    *
             *******************************************************************************************************/
            cardProducts.forEach((card) => (groupId += `${card.groupId},`));
            getProductHeaders.url = `https://api.tcgplayer.com/${VERSION}/catalog/groups/${groupId}`;
            let response = await axios(getProductHeaders);
            const groupIds = response.data.results;
            
            groupIds.forEach((group) => {
              if (setName === group.name) groupId = group.groupId;
            });

            const correctCard = cardProducts.find(
              (card) => card.groupId === groupId
            );
            tcg_imageUrl = correctCard.imageUrl;
            productId = correctCard.productId;
            getProductHeaders.url = `http://api.tcgplayer.com/${VERSION}/pricing/product/${productId}`;
            response = await axios(getProductHeaders);
            // console.log("prices", response.data.results);
            const results = response.data.results;
            for (let i = 0; i < results.length; i++) {
              if (
                results[i].marketPrice !== null &&
                results[i].midPrice !== null
              ) {
                marketPrice = results[i].marketPrice;
                midPrice = results[i].midPrice;
                break;
              }
            }
            /*******************************************************************************************************
             *   CONDITION A         Update the card with correct price information                                *
             *******************************************************************************************************/
            db.query(
              `SELECT
                b.*
              FROM card_errors2 a inner join cards2 b
              where a.name = b.name 
              and a.set_lookup = b.set_lookup 
              and a.name=?
              and a.set_lookup=?;`,
              [cardName, setName],
              (err, data) => {
                if (err) {
                  console.error("Error fetching card id");
                }
                const params = Object.values(data[0]);
                params[0] = 0;
                params[12] = marketPrice;
                params[13] = midPrice;
                params[14] = tcg_imageUrl;
                params[15] = productId;
                // console.log("params are", params, params.length);
                const queryStr = `INSERT INTO multiple_cards VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                db.query(queryStr, params, (err, data) => {
                  if (err) {
                    console.error(
                      "allNamesHaveExactMatch: error updating card with price info",
                      n,
                      cardName
                    );
                    console.log("node has stopped running");
                    return;
                  }
                  console.log(n, cardName);
                  n++;
                  if (n < END_COUNT) {
                    setTimeout(() => recurse(n), 100);
                  } else {
                    console.log("finished");
                    return;
                  }
                });
              }
            );
            /*******************************************************************************************************
                                            CONDITION B    
 Check if name matches first n letters of cardName for each card. Some cards, such as Abbey Matron, have multiple versions in the same set because of different art or different text. Sometimes a card may have multiple versions because of a promo. The code in CONDITION B block intends to handle these scenarios.
*******************************************************************************************************/
          } else if (allNamesStartWith) {
            // console.log("made it here", cardProducts, cardName, setName);
            const queryStr = `
            SELECT 
              b.*
            FROM card_errors2 a INNER JOIN cards2 b
              ON a.name = b.name AND a.set_lookup = b.set_lookup
            WHERE a.name = ? AND a.set_lookup = ?
            LIMIT 1;`;
            db.query(queryStr, [cardName, setName], async (err, data) => {
              if (err) {
                console.error("error retrieving data allNamesStartWith block");
              }
              const listOfCardsToInsert = [];
              for (let i = 0; i < cardProducts.length; i++) {
                const cardToInsert = { ...data[0] };
                // console.log('current card', cardProducts[i]);
                const prodId = cardProducts[i].productId;
                // console.log("prod id", prodId);
                getProductHeaders.url = `http://api.tcgplayer.com/${VERSION}/pricing/product/${prodId}`;
                response = await axios(getProductHeaders);
                const results = response.data.results;
                // console.log('current price of normal (not foil) card is', results[0]);
                results.forEach((card) => {
                  if (card.marketPrice !== null && card.midPrice !== null) {
                    marketPrice = card.marketPrice;
                    midPrice = card.midPrice;
                  }
                });
                cardToInsert.marketPrice = marketPrice;
                cardToInsert.midPrice = midPrice;
                cardToInsert.tcg_imageUrl = cardProducts[i].imageUrl;
                cardToInsert.tcg_prod_id = prodId;
                cardToInsert.tcg_card_name = cardProducts[i].name;
                // console.log('card to insert is', cardToInsert);
                listOfCardsToInsert.push(cardToInsert);
              }
              // console.log("list of cards to insert", listOfCardsToInsert);
              let k = 0;
              const populate = (i) => {
                // console.log("here", i, n);
                const params = Object.values(listOfCardsToInsert[i]);
                params[0] = 0;
                // console.log("params are", params, params.length);
                const queryStr = `INSERT INTO multiple_cards VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
                db.query(queryStr, params, (err, data) => {
                  if (err) {
                    console.error(
                      `allNamesStartWith: error inserting card into db`,
                      err
                    );
                  }
                  console.log(n, i, cardName);
                  i++;
                  if (i < listOfCardsToInsert.length) {
                    populate(i);
                  } else {
                    n++;
                    if (n < END_COUNT) {
                      setTimeout(() => recurse(n), 100);
                    } else {
                      console.log("finished");
                      return;
                    }
                  }
                });
              };
              populate(k);
            });
          } else {
            /*******************************************************************************************************
                                            CONDITION C    
 Find the card with the same card name. Sometimes An intro pack, booster pack, etc. is associated with the card name and thus also appears in the result. Thus, filter these out by looking for exact match in card name.
*******************************************************************************************************/
            // console.log("Condition C", n, cardName, cardProducts);
            let cardWithSameName = cardProducts.find(
              (card) => card.name === cardName
            );
            if (cardWithSameName === undefined) {
              cardWithSameName = cardProducts.find((card) => {
                if (card.name.startsWith(cardName)) {
                  return card;
                } else if (card.name.split(" // ").indexOf(cardName) > -1) {
                  return card;
                }
              });
            }
            // console.log("card with same name", cardWithSameName);
            const queryStr = `
            SELECT 
              b.*
            FROM card_errors2 a INNER JOIN cards2 b
              ON a.name = b.name AND a.set_lookup = b.set_lookup
            WHERE a.name = ? AND a.set_lookup = ?
            LIMIT 1;`;

            db.query(queryStr, [cardName, setName], async (err, data) => {
              if (err) {
                console.error("Condition C: error retrieving data");
              }
              const cardToInsert = { ...data[0] };
              const prodId = cardWithSameName.productId;
              getProductHeaders.url = `http://api.tcgplayer.com/${VERSION}/pricing/product/${prodId}`;
              response = await axios(getProductHeaders);
              const results = response.data.results;
              results.forEach((card) => {
                if (card.marketPrice !== null && card.midPrice !== null) {
                  marketPrice = card.marketPrice;
                  midPrice = card.midPrice;
                }
              });
              cardToInsert.marketPrice = marketPrice;
              cardToInsert.midPrice = midPrice;
              cardToInsert.tcg_imageUrl = cardWithSameName.imageUrl;
              cardToInsert.tcg_prod_id = prodId;
              cardToInsert.tcg_card_name = cardWithSameName.name;

              const params = Object.values(cardToInsert);
              params[0] = 0;
              // console.log("params are", params, params.length);
              const queryStr = `INSERT INTO multiple_cards VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
              db.query(queryStr, params, (err, data) => {
                if (err) {
                  console.error(
                    "Condition C: error updating card with price info",
                    n,
                    cardName
                  );
                  console.log("node has stopped running");
                  return;
                }
                console.log(n, cardName);
                n++;
                if (n < END_COUNT) {
                  setTimeout(() => recurse(n), 100);
                } else {
                  console.log("finished");
                  return;
                }
              });
            });
          }
        })
        .catch((err) => {
          console.error("error", n, cardName, err);
          console.log("script terminated");
          return;
        });
    }
  );
};
recurse(i);
