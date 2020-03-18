import React, { useState, useEffect } from "react";
import mockDeck from "./mockDeck";
import Deck from "./Deck";
import Hand from "./Hand";
import axios from "axios";
import Commands from "./Commands";
import Battleground from "./Battleground";

const App = () => {
  const [mainDeck, setMainDeck] = useState([""]);
  const [sideboard, setSideboard] = useState([""]);
  const [deckWithImages, setDeckWithImages] = useState({});
  const [handSize, setHandSize] = useState(7);
  const [indexCounter, setIndexCounter] = useState(0);
  const [field, setField] = useState([]);

  useEffect(() => {
    shuffleDeck();
  }, []);

  const shuffleDeck = () => {
    const deck = [];
    // console.log(mockDeck.trim().split("\n"));
    const mockDeckArr = mockDeck.trim().split("\n");
    let mainDeckIndex = 60;
    mockDeckArr.map((card, index) => {
      const firstSpace = card.indexOf(" ");
      const quantity =
        card.slice(0, firstSpace) === ""
          ? 0
          : parseInt(card.slice(0, firstSpace));
      // console.log(quantity);
      if (quantity === 0 && index > 60) mainDeckIndex = index;
      const cardName = card.slice(firstSpace);
      // console.log("quantity", quantity);
      // console.log("cardname", cardName);
      for (let i = 0; i < quantity; i++) {
        deck.push(cardName.trim());
      }
      // for (let i = 0; i < quantity; i++) {
      //   deck.push(cardName);
      // }
    });
    // console.log("unique deck", deck);
    const mainDeck = deck.slice(0, mainDeckIndex);
    // console.log('main deck is:', mainDeck);
    const sideboard = deck.slice(mainDeckIndex);
    // console.log("sideboard is:", sideboard);
    const randomizedDeck = shuffle(mainDeck);
    // console.log('shuffled main deck is:', randomizedDeck);
    setMainDeck(randomizedDeck);
    setSideboard(sideboard);
  };

  const shuffle = array => {
    let currentIndex = array.length,
      temporaryValue,
      randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  };

  // const addCardToDatabase = () => {
  //   axios
  //     .get("/card")
  //     .then(({ data }) => {
  //       console.log("axios res", data.card);
  //       const { name, imageUrl, multiverseid } = data.card;
  //       console.log(name, imageUrl, multiverseid);
  //     })
  //     .catch(err => {
  //       console.log("error", err);
  //     });
  // };

  const findCardByName = () => {
    axios
      .get("/name")
      .then(({ data }) => {
        console.log("findCardByName", data);
        const { name, imageUrl, multiverseid } = data;
      })
      .catch(err => {
        console.log("error", err);
      });
  };

  const getCardImages = () => {
    axios
      .get("/deck", {
        params: {
          mainDeck
        }
      })
      .then(({ data }) => {
        console.log("getCardImages", data);
        // const { name, imageUrl, multiverseid } = data;
        setDeckWithImages(data);
      })
      .catch(err => {
        console.log("error", err);
      });
  };

  const drawCard = () => {
    if (mainDeck.length === 0) return;
    const newHandSize = handSize + 1;
    console.log(newHandSize);
    setHandSize(newHandSize);
  };

  const onDragOver = e => {
    if (e) e.preventDefault();
  };

  const onDragStart = e => {
    console.log("onDragStart", e.target.id);
    if (e.dataTransfer) e.dataTransfer.setData("Text", e.target.id);
  };

  const onDrop = e => {
    if (e && e.dataTransfer) {
      let dataID = parseInt(e.dataTransfer.getData("Text"));
      console.log("ondrop triggered", e.dataTransfer.getData("Text"));
      let movedCard = deckWithImages[dataID];
      let updatedDeck = [
        ...deckWithImages.slice(0, dataID),
        ...deckWithImages.slice(dataID + 1)
      ];
      console.log(typeof dataID, dataID);
      console.log("updated deck is", deckWithImages, updatedDeck);
      setDeckWithImages(updatedDeck);
      setField([...field, movedCard]);
      setHandSize(handSize - 1);
      e.preventDefault();
    }
  };

  return (
    <div className="App">
      <img src="https://starlightrunner.com/wp-content/uploads/2019/09/Magic-The-Gathering-logo-800x279.png" className="mtg-logo"/>
      <Commands
        shuffleDeck={shuffleDeck}
        findCardByName={findCardByName}
        getCardImages={getCardImages}
        drawCard={drawCard}
      />
      <Battleground
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        indexCounter={indexCounter}
        setIndexCounter={setIndexCounter}
        field={field}
      />
      {deckWithImages.length > 0 && (
        <div className="inline">
          <Hand
            deckWithImages={deckWithImages}
            handSize={handSize}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            indexCounter={indexCounter}
            setIndexCounter={setIndexCounter}
          />
        </div>
      )}
      <Deck drawCard={drawCard} />
    </div>
  );
};

export default App;
