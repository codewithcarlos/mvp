import React, { useState, useEffect } from "react";
import mockDeck from "./mockDeck";
import Deck from "./Deck";
import Hand from "./Hand";
import axios from "axios";
import Commands from "./Commands";
import Battleground from "./Battleground";
import Graveyard from "./Graveyard";
import Exiled from "./Exiled";

const App = () => {
  const [mainDeck, setMainDeck] = useState([]);
  // const [sideboard, setSideboard] = useState([]);
  const [deckWithImages, setDeckWithImages] = useState({});
  const [handSize, setHandSize] = useState(0);
  const [hand, setHand] = useState([]);
  const [field, setField] = useState([]);
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [graveyard, setGraveyard] = useState([]);
  const [exiled, setExiled] = useState([]);

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
    // setSideboard(sideboard);
    return randomizedDeck;
  };

  const shuffle = (array) => {
    if (!array.length) return;
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
    if (deckWithImages.length !== undefined) setDeckWithImages(array);
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
      .catch((err) => {
        console.log("error", err);
      });
  };

  const newGame = () => {
    if (deckWithImages.length === undefined) {
      getCardImages();
      return;
    }
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
          mainDeck,
        },
      })
      .then(({ data }) => {
        console.log("getCardImages", data);
        for (let i = 0; i < data.length; i++) {
          data[i]["cardID"] = i;
        }
        setHandSize(7);
        setHand(data.slice(0, 7));
        setDeckWithImages(data.slice(7));
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const drawCard = () => {
    if (deckWithImages.length === undefined || deckWithImages.length === 0)
      return;
    const updatedDeck = [...deckWithImages];
    const movedCard = updatedDeck.splice(0, 1);
    setHand([...hand, ...movedCard]);
    setDeckWithImages(updatedDeck);
    setHandSize(handSize + 1);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    // e.stopPropagation();
  };

  const onDragStart = (e, zone) => {
    console.log("zone is", zone);
    e.persist();
    if (e.dataTransfer) {
      if (e.target.id !== "deck-img") e.target.style.opacity = "0.2";
      event.dataTransfer.setDragImage(e.target, 61, 85);
      e.dataTransfer.setData("Text", `${zone}-${e.target.id}`);
    }
  };

  const onBattlegroundDrop = (e) => {
    if (deckWithImages.length === undefined) return;
    if (e && e.dataTransfer) {
      e.target.style.opacity = "1";
      let dataID = e.dataTransfer.getData("Text").split("-");
      const zone = dataID[0];
      dataID = dataID[1];
      console.log("onBattlegroundDrop", zone);
      switch (zone) {
        case "deck":
          if (deckWithImages.length === 0) return;
          const updatedDeck = [...deckWithImages];
          let movedCard = updatedDeck.splice(0, 1);
          setCoordinates({
            ...coordinates,
            [movedCard[0].cardID]: { x: e.pageX - 70, y: e.pageY - 105 },
          });
          setField([...field, ...movedCard]);
          setDeckWithImages(updatedDeck);
          break;

        case "hand":
          movedCard = hand.find((card) => card.cardID == dataID);
          const updatedHand = hand.filter(
            (card) => card.cardID !== movedCard.cardID
          );
          setCoordinates({
            ...coordinates,
            [dataID]: { x: e.pageX - 70, y: e.pageY - 105 },
          });
          setHand(updatedHand);
          setField([...field, movedCard]);
          setHandSize(handSize - 1);
          break;

        case "field":
          movedCard = field.find((card) => card.cardID == dataID);
          setCoordinates({
            ...coordinates,
            [dataID]: { x: e.pageX - 70, y: e.pageY - 105 },
          });
          break;

        case "graveyard":
          const updatedGraveyard = [...graveyard];
          movedCard = updatedGraveyard.shift();
          setCoordinates({
            ...coordinates,
            [dataID]: { x: e.pageX - 70, y: e.pageY - 105 },
          });
          setGraveyard(updatedGraveyard);
          setField([...field, movedCard]);
          break;

        case "exiled":
          const updatedExiled = [...exiled];
          movedCard = updatedExiled.shift();
          setCoordinates({
            ...coordinates,
            [dataID]: { x: e.pageX - 70, y: e.pageY - 105 },
          });
          setExiled(updatedExiled);
          setField([...field, movedCard]);
          break;

        default:
          break;
      }

      e.preventDefault();
    }
  };

  const onHandDrop = (e) => {
    if (!deckWithImages.length) return;
    if (e && e.dataTransfer) {
      let dataID = e.dataTransfer.getData("Text").split("-");
      const zone = dataID[0];
      dataID = dataID[1];
      const targetId = e.target.id;
      // console.log("dataID", dataID);
      let updatedHand = [...hand];
      let currentCardIndex, targetCardIndex, movedCard;

      switch (zone) {
        case "deck":
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
          break;

        case "hand":
          hand.map((card, i) => {
            if (card.cardID == dataID) {
              movedCard = card;
              currentCardIndex = i;
            }
            if (card.cardID == targetId && targetId !== "") {
              targetCardIndex = i;
            }
          });
          updatedHand.splice(currentCardIndex, 1);
          updatedHand.splice(targetCardIndex, 0, movedCard);
          setHand(updatedHand);
          break;

        case "field":
          field.map((card, i) => {
            if (card.cardID == dataID) {
              movedCard = card;
              currentCardIndex = i;
            }
          });
          hand.map((card, i) => {
            if (card.cardID == targetId && targetId !== "") {
              targetCardIndex = i;
            }
          });

          let updatedField = [...field];
          updatedField.splice(currentCardIndex, 1);
          updatedHand.splice(targetCardIndex, 0, movedCard);
          setField(updatedField);
          setHand(updatedHand);
          setHandSize(handSize + 1);
          break;

        case "graveyard":
          const updatedGraveyard = [...graveyard];
          movedCard = updatedGraveyard.shift();
          hand.map((card, i) => {
            if (card.cardID == targetId && targetId !== "") {
              targetCardIndex = i;
            }
          });
          updatedHand.splice(targetCardIndex, 0, movedCard);
          setGraveyard(updatedGraveyard);
          setHand(updatedHand);
          setHandSize(handSize + 1);
          break;

        case "exiled":
          const updatedExiled = [...exiled];
          movedCard = updatedExiled.shift();
          hand.map((card, i) => {
            if (card.cardID == targetId && targetId !== "") {
              targetCardIndex = i;
            }
          });
          updatedHand.splice(targetCardIndex, 0, movedCard);
          setExiled(updatedExiled);
          setHand(updatedHand);
          setHandSize(handSize + 1);
          break;

        default:
          break;
      }
    }
  };

  const onDeckDrop = (e) => {
    e.persist();
    if (e && e.dataTransfer) {
      let dataID = e.dataTransfer.getData("Text").split("-");
      const zone = dataID[0];
      dataID = dataID[1];
      let updatedDeck = [...deckWithImages];

      let currentCardIndex, movedCard;
      console.log("onDeckDrop", zone);
      switch (zone) {
        case "hand":
          let updatedHand = [...hand];
          hand.map((card, i) => {
            if (card.cardID == dataID) {
              movedCard = card;
              currentCardIndex = i;
            }
          });
          updatedHand.splice(currentCardIndex, 1);
          updatedDeck.unshift(movedCard);
          setHand(updatedHand);
          setDeckWithImages(updatedDeck);
          break;

        case "field":
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
          break;

        case "graveyard":
          const updatedGraveyard = [...graveyard];
          movedCard = updatedGraveyard.shift();
          updatedDeck.unshift(movedCard);
          setGraveyard(updatedGraveyard);
          setDeckWithImages(updatedDeck);
          break;

        case "exiled":
          const updatedExiled = [...exiled];
          movedCard = updatedExiled.shift();
          updatedDeck.unshift(movedCard);
          setExiled(updatedExiled);
          setDeckWithImages(updatedDeck);
          break;

        default:
          break;
      }
    }
  };

  const onGraveyardDrop = (e) => {
    if (e && e.dataTransfer) {
      let dataID = e.dataTransfer.getData("Text").split("-");
      const zone = dataID[0];
      dataID = dataID[1];
      let updatedGraveyard = [...graveyard];

      let currentCardIndex, movedCard;
      console.log("onGraveyardDrop", zone);
      switch (zone) {
        case "hand":
          let updatedHand = [...hand];
          hand.map((card, i) => {
            if (card.cardID == dataID) {
              movedCard = card;
              currentCardIndex = i;
            }
          });
          updatedHand.splice(currentCardIndex, 1);
          updatedGraveyard.unshift(movedCard);
          setHand(updatedHand);
          setGraveyard(updatedGraveyard);
          break;

        case "field":
          field.map((card, i) => {
            if (card.cardID == dataID) {
              movedCard = card;
              currentCardIndex = i;
            }
          });
          let updatedField = [...field];
          updatedField.splice(currentCardIndex, 1);
          updatedGraveyard.unshift(movedCard);
          setField(updatedField);
          setGraveyard(updatedGraveyard);
          break;

        case "deck":
          const updatedDeck = [...deckWithImages];
          movedCard = updatedDeck.splice(0, 1);
          updatedGraveyard.unshift(movedCard[0]);
          setDeckWithImages(updatedDeck);
          setGraveyard(updatedGraveyard);
          break;

        case "exiled":
          const updatedExiled = [...exiled];
          movedCard = updatedExiled.shift();
          updatedGraveyard.unshift(movedCard);
          setExiled(updatedExiled);
          setGraveyard(updatedGraveyard);
          break;

        default:
          break;
      }
    }
  };
  const onExiledDrop = (e) => {
    if (e && e.dataTransfer) {
      let dataID = e.dataTransfer.getData("Text").split("-");
      const zone = dataID[0];
      dataID = dataID[1];
      let updatedExiled = [...exiled];

      let currentCardIndex, movedCard;
      console.log("onExiledDrop", zone);
      switch (zone) {
        case "hand":
          let updatedHand = [...hand];
          hand.map((card, i) => {
            if (card.cardID == dataID) {
              movedCard = card;
              currentCardIndex = i;
            }
          });
          updatedHand.splice(currentCardIndex, 1);
          updatedExiled.unshift(movedCard);
          // console.log("moved card and update exiled", movedCard, updatedExiled);
          setHand(updatedHand);
          setExiled(updatedExiled);
          break;

        case "field":
          field.map((card, i) => {
            if (card.cardID == dataID) {
              movedCard = card;
              currentCardIndex = i;
            }
          });
          let updatedField = [...field];
          updatedField.splice(currentCardIndex, 1);
          updatedExiled.unshift(movedCard);
          setField(updatedField);
          setExiled(updatedExiled);
          break;

        case "deck":
          const updatedDeck = [...deckWithImages];
          movedCard = updatedDeck.splice(0, 1);
          updatedExiled.unshift(movedCard[0]);
          setDeckWithImages(updatedDeck);
          setExiled(updatedExiled);
          break;

        case "graveyard":
          const updatedGraveyard = [...graveyard];
          movedCard = updatedGraveyard.shift();
          updatedExiled.unshift(movedCard);
          setGraveyard(updatedGraveyard);
          setExiled(updatedExiled);
          break;

        default:
          break;
      }
    }
  };

  const onDragEnd = (e) => {
    // console.log("onDragEnd", e.target);
    e.target.style.opacity = "1";
  };

  return (
    <div className="app">
      <Commands
        shuffle={shuffle}
        findCardByName={findCardByName}
        getCardImages={getCardImages}
        drawCard={drawCard}
        newGame={newGame}
        deck={deckWithImages}
      />
      <Battleground
        field={field}
        coordinates={coordinates}
        onDragOver={onDragOver}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDrop={onBattlegroundDrop}
      />
      {deckWithImages.length >= 0 && (
        <div className="container-flex">
          <Hand
            deckWithImages={deckWithImages}
            hand={hand}
            handSize={handSize}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrop={onHandDrop}
          />
          <div className="zones">
            <Deck
              drawCard={drawCard}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onDrop={onDeckDrop}
            />
            <Graveyard
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onDrop={onGraveyardDrop}
              graveyard={graveyard}
            />
            <Exiled
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onDrop={onExiledDrop}
              exiled={exiled}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
