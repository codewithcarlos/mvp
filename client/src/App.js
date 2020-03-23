import React, { useState, useEffect, useCallback } from "react";
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
  const [hand, setHand] = useState({});
  const [field, setField] = useState([]);
  const [coordinates, setCoordinates] = useState({});

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
        for (let i = 0; i < data.length; i++) {
          data[i]["cardID"] = i;
        }
        setHand(data.slice(0, handSize));
        setDeckWithImages(data.slice(handSize));
      })
      .catch(err => {
        console.log("error", err);
      });
  };

  const drawCard = () => {
    if (deckWithImages.length === 0) return;
    const updatedDeck = [...deckWithImages];
    const movedCard = updatedDeck.splice(0, 1);
    setHand([...hand, ...movedCard]);
    setDeckWithImages(updatedDeck);
    setHandSize(handSize + 1);
  };

  const onDragOver = e => {
    if (e) e.preventDefault();
  };

  const onDragStart = e => {
    e.persist();
    console.log("onDragStart", e.target.id, e);
    console.log(deckWithImages.length);
    if (e.dataTransfer) e.dataTransfer.setData("Text", e.target.id);
  };

  const onDrop = e => {
    if (!deckWithImages.length) return;
    if (e && e.dataTransfer) {
      let dataID = e.dataTransfer.getData("Text");

      if (dataID === "deck-img") {
        const updatedDeck = [...deckWithImages];
        const movedCard = updatedDeck.splice(0, 1);
        console.log("triggered", movedCard);
        setCoordinates({
          ...coordinates,
          [movedCard[0].cardID]: { x: e.pageX - 150, y: e.pageY - 80 }
        });
        setField([...field, ...movedCard]);
        setDeckWithImages(updatedDeck);
        return;
      }

      dataID = parseInt(dataID);
      // console.log("ondrop triggered", e.dataTransfer.getData("Text"));
      const movedCard = hand.find(card => card.cardID === dataID);
      // console.log("moved card is", movedCard);
      const updatedHand = hand.filter(card => card.cardID !== movedCard.cardID);

      setCoordinates({
        ...coordinates,
        [dataID]: { x: e.pageX - 150, y: e.pageY - 160 }
      });
      // setDeckWithImages(updatedDeck);
      setHand(updatedHand);
      setField([...field, movedCard]);
      setHandSize(handSize - 1);
      e.preventDefault();
    }
  };

  return (
    <div className="App">
      {/* <img
        src="https://starlightrunner.com/wp-content/uploads/2019/09/Magic-The-Gathering-logo-800x279.png"
        className="mtg-logo"
      /> */}
      <Commands
        shuffleDeck={shuffleDeck}
        findCardByName={findCardByName}
        getCardImages={getCardImages}
        drawCard={drawCard}
      />
      <Battleground
        onDrop={onDrop}
        onDragOver={onDragOver}
        field={field}
        coordinates={coordinates}
      />
      {deckWithImages.length > 0 && (
        <div className="inline">
          <Hand
            deckWithImages={deckWithImages}
            hand={hand}
            handSize={handSize}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
          />
        </div>
      )}
      <Deck drawCard={drawCard} onDragStart={onDragStart} />
    </div>
  );
};

export default App;
