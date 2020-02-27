const { findCardByName } = require("../api/mtgAPI.js");
const { insertCard } = require("../db/index");

const deck = [
  "Archmage's Charm",
  "Arcum's Astrolabe",
  "Ashiok, Dream Render",
  "Batterskull",
  "Breeding Pool",
  "Celestial Colonnade",
  "Cryptic Command",
  "Field of Ruin",
  "Flooded Strand",
  "Force of Negation",
  "Hallowed Fountain",
  "Ice-Fang Coatl",
  "Jace, the Mind Sculptor",
  "Mana Leak",
  "Misty Rainforest",
  "Mystic Sanctuary",
  "Once Upon a Time",
  "Path to Exile",
  "Snapcaster Mage",
  "Snow-Covered Forest",
  "Snow-Covered Island",
  "Snow-Covered Plains",
  "Steam Vents",
  "Stoneforge Mystic",
  "Supreme Verdict",
  "Sword of Feast and Famine",
  "Teferi, Time Raveler",
  "Temple Garden",
  "Uro, Titan of Nature's Wrath",
  "Aether Gust",
  "Ashiok, Dream Render",
  "Blood Moon",
  "Disdainful Stroke",
  "Kor Firewalker",
  "Mystical Dispute",
  "Rest in Peace",
  "Return to Nature",
  "Surgical Extraction",
  "Timely Reinforcements",
  "Veil of Summer"
];

let j = 0;
var populate = () => {
  findCardByName(deck[j], data => {
    let firstValidCard;
    let multiverseid;
    for (let i = 0; i < data.length; i++) {
      if (data[i].multiverseid) {
        firstValidCard = data[i];
        break;
      }
    }
    console.log(j);
    if (!firstValidCard) {
      firstValidCard = data[0];
      multiverseid = -1;
    } else {
      multiverseid = firstValidCard.multiverseid;
    }
    const { name, imageUrl } = firstValidCard;
    // console.log(name, imageUrl, multiverseid, firstValidCard);
    insertCard([name, imageUrl, multiverseid], (err, result) => {
      if (err) {
        console.log("error inserting card into the db", j);
      }
      j++;
      if (j < deck.length) populate();
    });
  });
};
populate();
