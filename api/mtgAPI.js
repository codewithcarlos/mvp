const mtg = require("mtgsdk");

const getMagicCard = (callback) => {
  mtg.card.find(3).then((result) => {
    console.log(result);
    console.log(result.card.name); // "Black Lotus"
    callback(result);
  });
};

const findCardByName = (term, callback) => {
  mtg.card.where({ name: term }).then((result) => {
    callback(result);
  });
};
// findCardByName("Walking Ballista", (data) => {
//   console.log(data[0]);
// });

module.exports = { getMagicCard, findCardByName };
