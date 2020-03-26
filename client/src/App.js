import React, { useState, useEffect, useCallback } from "react";
import mockDeck from "./mockDeck";
import Deck from "./Deck";
import Hand from "./Hand";
import axios from "axios";
import Commands from "./Commands";
import Battleground from "./Battleground";

const App = () => {
  const [mainDeck, setMainDeck] = useState([]);
  // const [sideboard, setSideboard] = useState([]);
  const [deckWithImages, setDeckWithImages] = useState({});
  const [handSize, setHandSize] = useState(0);
  const [hand, setHand] = useState({});
  const [field, setField] = useState([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    shuffleDeck();
  }, []);

  // useEffect(() => {

  // }, [mainDeck])

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
    // setSideboard(sideboard);
    return randomizedDeck;
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

  const newGame = () => {
    const shuffledDeck = shuffle([...deckWithImages, ...field, ...hand]);
    // console.log("shuffledDeck", shuffledDeck, shuffledDeck.length);
    setCoordinates({});
    setField([]);
    setHandSize(7);
    setHand(shuffledDeck.slice(0, 7));
    setDeckWithImages(shuffledDeck.slice(7));
  };

  const getCardImages = () => {
    console.log("axios called");
    axios
      .get("/deck", {
        params: {
          mainDeck
        }
      })
      .then(({ data }) => {
        // setCoordinates({});
        // setField([]);
        console.log("getCardImages", data);
        for (let i = 0; i < data.length; i++) {
          data[i]["cardID"] = i;
        }
        setHandSize(7);
        setHand(data.slice(0, 7));
        setDeckWithImages(data.slice(7));
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
    e.preventDefault();
    e.stopPropagation();
    // console.log("dragover", e.target.style.opacity);
    // e.target.style.opacity = "1";
  };

  const onDragStart = e => {
    e.persist();
    if (e.dataTransfer) {
      if (e.target.id !== "deck-img") e.target.style.opacity = "0";
      if (e.target.className === "card-image rotated") {
        e.target.style.opacity = "1";
        event.dataTransfer.setDragImage(e.target, 0, 50);
      }
      e.dataTransfer.setData("Text", e.target.id);
    }
  };

  const onBattlegroundDrop = e => {
    // console.log("on drop triggered", deckWithImages.length);
    if (deckWithImages.length === undefined) return;
    if (e && e.dataTransfer) {
      // console.log("event target on drop is", e.dataTransfer);
      e.target.style.opacity = "1";
      let dataID = e.dataTransfer.getData("Text");
      // console.log("dataID", dataID);
      if (dataID === "deck-img") {
        if (deckWithImages.length === 0) return;
        const updatedDeck = [...deckWithImages];
        const movedCard = updatedDeck.splice(0, 1);
        setCoordinates({
          ...coordinates,
          [movedCard[0].cardID]: { x: e.pageX - 150, y: e.pageY - 80 }
        });
        setField([...field, ...movedCard]);
        setDeckWithImages(updatedDeck);
        return;
      }

      let movedCard = hand.find(card => card.cardID == dataID);
      if (!movedCard) {
        movedCard = field.find(card => card.cardID == dataID);
        setCoordinates({
          ...coordinates,
          [dataID]: { x: e.pageX - 130, y: e.pageY - 90 }
        });
        return;
      }

      const updatedHand = hand.filter(card => card.cardID !== movedCard.cardID);
      setCoordinates({
        ...coordinates,
        [dataID]: { x: e.pageX - 130, y: e.pageY - 90 }
      });
      setHand(updatedHand);
      setField([...field, movedCard]);
      setHandSize(handSize - 1);
      e.preventDefault();
    }
  };

  const onHandDrop = e => {
    // e.persist();
    // console.log("onHandDrop triggered", e);
    // console.log("target card", e.target.id);
    if (!deckWithImages.length) return;
    if (e && e.dataTransfer) {
      let dataID = e.dataTransfer.getData("Text");
      const targetId = e.target.id;
      // console.log("dataID", dataID);
      let updatedHand = [...hand];
      let currentCardIndex, targetCardIndex, movedCard;

      if (dataID === "deck-img") {
        // console.log("targetId", targetId === "");
        if (targetId === "") {
          drawCard();
          return;
        }
        const updatedDeck = [...deckWithImages];
        movedCard = updatedDeck.splice(0, 1);
        hand.map((card, i) => {
          if (card.cardID == targetId) targetCardIndex = i;
        });
        updatedHand.splice(targetCardIndex, 0, ...movedCard);
        setHand(updatedHand);
        setHandSize(handSize + 1);
        setDeckWithImages(updatedDeck);
        return;
      }

      // dataID = parseInt(dataID);
      // if (targetId === "") return;

      hand.map((card, i) => {
        // console.log("handmap", i, targetId, card.cardID);
        if (card.cardID == dataID) {
          movedCard = card;
          currentCardIndex = i;
        }
        if (card.cardID == targetId && targetId !== "") {
          targetCardIndex = i;
        }
      });
      // console.log("currentCardIndex", currentCardIndex);
      // console.log("targetCardIndex", targetCardIndex);
      if (currentCardIndex === undefined) {
        field.map((card, i) => {
          if (card.cardID == dataID) {
            movedCard = card;
            currentCardIndex = i;
          }
          if (card.cardID == targetId && targetId !== "") {
            targetCardIndex = i;
          }
          // console.log("fieldmap", i, targetId, card.cardID);
        });
        let updatedField = [...field];
        updatedField.splice(currentCardIndex, 1);
        updatedHand.splice(targetCardIndex, 0, movedCard);
        // console.log("updatedField", updatedField);
        // console.log("updatedHand", updatedHand);
        setField(updatedField);
        setHand(updatedHand);
        setHandSize(handSize + 1);
        return;
      }
      updatedHand.splice(currentCardIndex, 1);
      updatedHand.splice(targetCardIndex, 0, movedCard);
      // console.log("the updated hand is", updatedHand);
      setHand(updatedHand);
    }
  };

  const onDeckDrop = e => {
    e.persist();
    // console.log("onHandDrop triggered", e);
    if (e && e.dataTransfer) {
      let dataID = e.dataTransfer.getData("Text");
      const targetId = e.target.id;
      console.log("target card", targetId);
      console.log("current card id", dataID);
      let updatedHand = [...hand];
      let updatedDeck = [...deckWithImages];

      // check first if card is coming from hand
      let currentCardIndex, movedCard;
      hand.map((card, i) => {
        if (card.cardID == dataID) {
          movedCard = card;
          currentCardIndex = i;
        }
      });

      // if not from hand, then card comes from battleground
      if (currentCardIndex === undefined) {
        field.map((card, i) => {
          if (card.cardID == dataID) {
            movedCard = card;
            currentCardIndex = i;
          }
        });
        let updatedField = [...field];
        updatedField.splice(currentCardIndex, 1);
        updatedDeck.unshift(movedCard);
        setField(updatedField);
        setDeckWithImages(updatedDeck);
        return;
      }
      updatedHand.splice(currentCardIndex, 1);
      updatedDeck.unshift(movedCard);
      setHand(updatedHand);
      setDeckWithImages(updatedDeck);
    }
  };

  const handleDragEnd = e => {
    // console.log("handleDragEnd", e.target);
    e.target.style.opacity = "1";
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
        newGame={newGame}
      />
      <Battleground
        onDrop={onBattlegroundDrop}
        onDragOver={onDragOver}
        field={field}
        coordinates={coordinates}
        onDragStart={onDragStart}
        onDragEnd={handleDragEnd}
      />
      {deckWithImages.length >= 0 && (
        <div className="inline">
          <Hand
            deckWithImages={deckWithImages}
            hand={hand}
            handSize={handSize}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            onDrop={onHandDrop}
            onDragEnd={handleDragEnd}
          />
        </div>
      )}
      <Deck
        drawCard={drawCard}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDeckDrop}
        onDragEnd={handleDragEnd}
      />
    </div>
  );
};

export default App;
