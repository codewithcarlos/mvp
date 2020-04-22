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
        ? (queryString += `'${cardName}');`)
        : (queryString += `'${cardName}',`);
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
            };
          } else {
            updatedCard = {
              ...cardInLibrary,
              cmc: card.cmc,
              imageUrl: card.imageUrl,
              manaCost: manaCost,
            };
          }

          // for DeckTableView (i.e. to list out the cards by type)
          let cardType = "";
          if (inSideboard && !cardInLibrary) {
            // if card is found only in sideboard, then add card only to sideboard
            cardType = "Sideboard";
            this.handleCountObject(card, sideboard, newCount, updatedCard, cardType);
          } else if (inSideboard && cardInLibrary) {
            // if card is found in both library and sideboard, add to both
            this.handleCountObject(card, postedDeck, newCount, updatedCard, cardType);
            cardType = "Sideboard";
            this.handleCountObject(card, sideboard, newCount, updatedCard, cardType);
          } else {
            // add card only to library
            this.handleCountObject(card, postedDeck, newCount, updatedCard, cardType);
          }
          
          // store data needed for playtest components
          if (cardInLibrary)
            cardInLibrary = { ...cardInLibrary, ...card };
          if (inSideboard) {
            sideboard[card.name] = { ...sideboard[card.name], ...card };
          }
        });
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
    const manaCostList = [];
    for (let i = 0; i < manaCost.length; i += 3) {
      switch (manaCost[i + 1]) {
        case "R":
          manaCostList.push("./mountain.jpg");
          break;
        case "W":
          manaCostList.push("./plains.jpg");
          break;
        case "G":
          manaCostList.push("./forest.jpg");
        case "B":
          manaCostList.push("./swamp.jpg");
          break;
        case "U":
          manaCostList.push("./island.jpg");
          break;
        default:
          manaCostList.push(manaCost[i + 1]);
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
