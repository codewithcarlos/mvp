import { observable, action } from "mobx";
import axios from "axios";

export default class DeckStore {
  constructor(rootStore) {
    this.rootStore = rootStore;
  }

  @observable deck = {};
  @observable count = {};

  @action setDeck = (importedDeck) => {
    this.deck = importedDeck;
    // console.log("deck store", this.deck);
  };

  @action setCount = (count) => {
    this.count = count;
    // console.log("count", this.count);
  };

  @action initializeDeckAndQueryString = (listArr) => {
    let queryString = "(";
    const postedDeck = {};
    for (let i = 0; i < listArr.length; i++) {
      const card = listArr[i];
      if (card === "") break;
      const cardIndex = card.indexOf(" ");
      const cardQuantity = parseInt(card.slice(0, cardIndex));
      const cardName = card.slice(cardIndex + 1);
      postedDeck[cardName] = { cardQuantity, cardName };
      listArr[i + 1] === ""
        ? (queryString += `'${cardName}');`)
        : (queryString += `'${cardName}',`);
    }
    return { postedDeck, queryString };
  };

  @action fetchData = async (newCount, postedDeck, queryString) => {
    const result = await axios
      .post("/deck", {
        queryString,
      })
      .then(({ data }) => {
        console.log("getCardImages", data);
        data.forEach((card, i) => {
          const updatedCard = {
            ...postedDeck[card.name],
            cmc: card.cmc,
            imageUrl: card.imageUrl,
            manaCost: card.manaCost,
          };
          let cardType = "";
          if (card.types.indexOf("Creature") !== -1) {
            cardType = "Creature";
            if (newCount[cardType]) {
              newCount[cardType]["count"] += postedDeck[card.name].cardQuantity;
              newCount[cardType]["cards"].push(updatedCard);
            } else {
              newCount[cardType] = {
                count: postedDeck[card.name].cardQuantity,
                cards: [updatedCard],
              };
            }
          } else {
            cardType = card.types.split(",")[0];
            if (newCount[cardType]) {
              newCount[cardType]["count"] += postedDeck[card.name].cardQuantity;
              newCount[cardType]["cards"].push(updatedCard);
            } else {
              newCount[cardType] = {
                count: postedDeck[card.name].cardQuantity,
                cards: [updatedCard],
              };
            }
          }
          postedDeck[card.name] = { ...postedDeck[card.name], ...card };
        });
        return [newCount, postedDeck];
      })
      .catch((err) => {
        console.log("error", err);
      });
    // console.log("result is:", result);
    for (let key in result[0]) {
      result[0][key]["cards"] = result[0][key]["cards"].sort((a, b) => {
        if (a.cmc < b.cmc) {
          return -1;
        } else if (a.cmc > b.cmc) {
          return 1;
        } else {
          if (a.name < b.name) {
            return -1;
          } else {
            return 1;
          }
        }
      });
    }
    this.setCount(result[0]);
    this.setDeck(result[1]);
  };
}
