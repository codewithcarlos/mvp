import { observable, action } from "mobx";
import axios from "axios";

export default class DeckStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable library = {};
  @observable sideboard = {};
  @observable count = {};

  @action setLibrary = (library) => {
    this.library = library;
  };
  @action setSideboard = (sideboard) => {
    this.sideboard = sideboard;
  };

  @action setCount = (count) => {
    this.count = count;
  };

  @action initializeDeckAndQueryString = (listArr) => {
    let queryString = "(";
    const postedDeck = {};
    const sideboard = {};
    let inSideboard = false;
    let cardCount = 0;
    for (let i = 0; i < listArr.length; i++) {
      const card = listArr[i];
      if (card === "" && cardCount > 59) {
        inSideboard = true;
        continue;
      }
      const cardIndex = card.indexOf(" ");
      const cardQuantity = parseInt(card.slice(0, cardIndex));
      cardCount += cardQuantity;
      const cardName = card.slice(cardIndex + 1);
      inSideboard
        ? (sideboard[cardName] = { cardQuantity, cardName })
        : (postedDeck[cardName] = { cardQuantity, cardName });
      i + 1 === listArr.length
        ? (queryString += `"${cardName}");`)
        : (queryString += `"${cardName}",`);
    }
    return { postedDeck, queryString, sideboard };
  };

  @action fetchData = async (newCount, postedDeck, sideboard, queryString) => {
    const result = await axios
      .post("/deck", {
        queryString,
      })
      .then(({ data }) => {
        console.log("getCardImages", data);
        data.forEach((card, i) => {
          const manaCost = this.handleManaCost(card.manaCost);
          let cardInLibrary = postedDeck[card.name];
          let inSideboard = sideboard[card.name] ? true : false;
          let updatedCard;
          if (inSideboard) {
            updatedCard = {
              ...sideboard[card.name],
              cmc: card.cmc,
              imageUrl: card.imageUrl,
              manaCost: manaCost,
              marketPrice: (
                card.marketPrice * sideboard[card.name].cardQuantity
              ).toFixed(2),
            };
          } else {
            updatedCard = {
              ...cardInLibrary,
              cmc: card.cmc,
              imageUrl: card.imageUrl,
              manaCost: manaCost,
              marketPrice: (
                card.marketPrice * cardInLibrary.cardQuantity
              ).toFixed(2),
            };
          }

          // for DeckTableView (i.e. to list out the cards by type)
          let cardType = "";
          if (inSideboard && !cardInLibrary) {
            // if card is found only in sideboard, then add card only to sideboard
            cardType = "Sideboard";
            this.handleCountObject(
              card,
              sideboard,
              newCount,
              updatedCard,
              cardType
            );
          } else if (inSideboard && cardInLibrary) {
            // if card is found in both library and sideboard, add to both
            this.handleCountObject(
              card,
              postedDeck,
              newCount,
              updatedCard,
              cardType
            );
            cardType = "Sideboard";
            this.handleCountObject(
              card,
              sideboard,
              newCount,
              updatedCard,
              cardType
            );
          } else {
            // add card only to library
            this.handleCountObject(
              card,
              postedDeck,
              newCount,
              updatedCard,
              cardType
            );
          }

          // store data needed for playtest components
          if (cardInLibrary) {
            postedDeck[card.name] = { ...cardInLibrary, ...card };
          }
          if (inSideboard) {
            sideboard[card.name] = { ...sideboard[card.name], ...card };
          }
        });
        // console.log('the posted deck is', postedDeck)
        return [newCount, postedDeck, sideboard];
      })
      .catch((err) => {
        console.log("error", err);
      });

    for (let key in result[0]) {
      result[0][key]["cards"] = result[0][key]["cards"].sort((a, b) => {
        if (a.cmc < b.cmc) {
          return -1;
        } else if (a.cmc > b.cmc) {
          return 1;
        } else {
          if (a.cardName < b.cardName) {
            return -1;
          } else {
            return 1;
          }
        }
      });
    }
    this.setCount(result[0]);
    this.setLibrary(result[1]);
    this.setSideboard(result[2]);
  };

  @action handleManaCost = (manaCost) => {
    if (!manaCost) return "";
    const regex = /((?!^)\{.*?\})/;
    const splitManaCost = manaCost.split(regex).filter(Boolean);
    const manaCostList = [];
    for (let i = 0; i < splitManaCost.length; i++) {
      switch (splitManaCost[i]) {
        case "{R}":
          manaCostList.push("../mountain.jpg");
          break;
        case "{W}":
          manaCostList.push("../plains.jpg");
          break;
        case "{G}":
          manaCostList.push("../forest.jpg");
          break;
        case "{B}":
          manaCostList.push("../swamp.jpg");
          break;
        case "{U}":
          manaCostList.push("../island.jpg");
          break;
        case "{W/B}":
          // manaCostList.push("../plains_swamp.jpg");
          manaCostList.push("../WB.svg");
          break;
        case "{U/B}":
          // manaCostList.push("../island_swamp.jpg");
          manaCostList.push("../WB.svg");
          break;
        case "{W/U}":
          // manaCostList.push("../plains_island.jpg");
          manaCostList.push("../WU.svg");
          break;
        case "{S}":
          manaCostList.push("../snow.jpg");
          break;
        case "{B/P}":
          // manaCostList.push("../phyrexian_swamp.jpg");
          manaCostList.push("../BP.svg");
          break;
        case "{R/G}":
          // manaCostList.push("../mountain_forest.jpg");
          manaCostList.push("../RG.svg");
          break;
        case "{B/R}":
          // manaCostList.push("../swamp_mountain.jpg");
          manaCostList.push("../BR.svg");
          break;
        case "{G/W}":
          // manaCostList.push("../forest_plains.jpg");
          manaCostList.push("../GW.svg");
          break;
        case "{U/R}":
          // manaCostList.push("../island_mountain.jpg");
          manaCostList.push("../UR.svg");
          break;
        case "{B/G}":
          // manaCostList.push("../swamp_forest.jpg");
          manaCostList.push("../BG.svg");
          break;
        case "{R/W}":
          // manaCostList.push("../mountain_plains.jpg");
          manaCostList.push("../RW.svg");
          break;
        case "{U/G}":
          // manaCostList.push("../forest_island.jpg");
          manaCostList.push("../UG.svg");
          break;
        case "{2/W}":
          // manaCostList.push("../generic_plains.jpg");
          manaCostList.push("../2W.svg");
          break;
        case "{2/U}":
          // manaCostList.push("../generic_island.jpg");
          manaCostList.push("../2U.svg");
          break;
        case "{2/B}":
          // manaCostList.push("../generic_swamp.jpg");
          manaCostList.push("../2B.svg");
          break;
        case "{2/R}":
          // manaCostList.push("../generic_mountain.jpg");
          manaCostList.push("../2R.svg");
          break;
        case "{2/G}":
          // manaCostList.push("../generic_forest.jpg");
          manaCostList.push("../2G.svg");
          break;
        default:
          manaCostList.push(
            splitManaCost[i].substring(1, splitManaCost[i].length - 1)
          );
          break;
      }
    }
    return manaCostList;
  };

  @action handleCountObject = (card, zone, newCount, updatedCard, cardType) => {
    if (cardType !== "Sideboard") {
      if (card.types.indexOf("Creature") !== -1) {
        cardType = "Creature";
        if (newCount[cardType]) {
          newCount[cardType]["count"] += zone[card.name].cardQuantity;
          newCount[cardType]["cards"].push(updatedCard);
        } else {
          newCount[cardType] = {
            count: zone[card.name].cardQuantity,
            cards: [updatedCard],
          };
        }
      } else if (card.types === "Instant" || card.types === "Sorcery") {
        cardType = "Spells";
        if (newCount[cardType]) {
          newCount[cardType]["count"] += zone[card.name].cardQuantity;
          newCount[cardType]["cards"].push(updatedCard);
        } else {
          newCount[cardType] = {
            count: zone[card.name].cardQuantity,
            cards: [updatedCard],
          };
        }
      } else {
        cardType = card.types.split(",")[0];
        if (newCount[cardType]) {
          newCount[cardType]["count"] += zone[card.name].cardQuantity;
          newCount[cardType]["cards"].push(updatedCard);
        } else {
          newCount[cardType] = {
            count: zone[card.name].cardQuantity,
            cards: [updatedCard],
          };
        }
      }
    } else {
      if (newCount[cardType]) {
        newCount[cardType]["count"] += zone[card.name].cardQuantity;
        newCount[cardType]["cards"].push(updatedCard);
      } else {
        newCount[cardType] = {
          count: zone[card.name].cardQuantity,
          cards: [updatedCard],
        };
      }
    }
  };
}
