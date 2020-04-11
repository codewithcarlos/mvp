import React, { useState, useEffect } from "react";
import mockDeck from "./mockDeck";
import Deck from "./Deck";
import Hand from "./Hand";
import axios from "axios";
import Commands from "./Commands";
import Battleground from "./Battleground";
import Graveyard from "./Graveyard";
import Exiled from "./Exiled";
import NavBar from "./NavBar";

const App = () => {
  const [importedDeck, setImportedDeck] = useState([]);
  // const [sideboard, setSideboard] = useState([]);
  const [library, setLibrary] = useState({});
  const [hand, setHand] = useState([]);
  const [field, setField] = useState([]);
  const [graveyard, setGraveyard] = useState([]);
  const [exiled, setExiled] = useState([]);
  const [coordinates, setCoordinates] = useState({});
  const [untapAll, setUntapAll] = useState(false);

  useEffect(() => {
    parseDeck();
  }, []);

  const parseDeck = () => {
    const deck = [];
    console.log("parse step 1", mockDeck.trim().split("\n"));
    const mockDeckArr = mockDeck.trim().split("\n");
    let importedDeckIndex = 60;
    mockDeckArr.map((card, index) => {
      const firstSpace = card.indexOf(" ");
      const quantity =
        card.slice(0, firstSpace) === ""
          ? 0
          : parseInt(card.slice(0, firstSpace));
      // console.log(quantity);
      if (quantity === 0 && index > 60) importedDeckIndex = index;
      const cardName = card.slice(firstSpace);
      // console.log("quantity", quantity);
      // console.log("cardname", cardName);
      for (let i = 0; i < quantity; i++) {
        deck.push(cardName.trim());
      }
    });
    // console.log("unique deck", deck);
    const importedDeck = deck.slice(0, importedDeckIndex);
    // console.log("main deck is:", importedDeck);
    const sideboard = deck.slice(importedDeckIndex);
    // console.log("sideboard is:", sideboard);
    const randomizedDeck = shuffle(importedDeck);
    // console.log('shuffled main deck is:', randomizedDeck);
    setImportedDeck(randomizedDeck);
    // setSideboard(sideboard);
    // return randomizedDeck;
  };

  const shuffle = (array) => {
    if (!array.length) return array;
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
    if (library.length !== undefined) setLibrary(array);
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
    if (library.length === undefined) {
      getCardImages(importedDeck);
      return;
    }
    const shuffledDeck = shuffle([
      ...library,
      ...field,
      ...hand,
      ...graveyard,
      ...exiled,
    ]);
    // console.log("shuffledDeck", shuffledDeck, shuffledDeck.length);
    setCoordinates({});
    setField([]);
    setGraveyard([]);
    setExiled([]);
    setHand(shuffledDeck.slice(0, 7));
    setLibrary(shuffledDeck.slice(7));
  };

  const getCardImages = (importedDeck) => {
    // console.log("axios called", importedDeck);
    axios
      .get("/deck", {
        params: {
          importedDeck,
        },
      })
      .then(({ data }) => {
        console.log("getCardImages", data);
        for (let i = 0; i < data.length; i++) {
          data[i]["cardID"] = i;
        }
        setHand(data.slice(0, 7));
        setLibrary(data.slice(7));
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const drawCard = () => {
    if (library.length === undefined || library.length === 0) return;
    const updatedDeck = [...library];
    const movedCard = updatedDeck.splice(0, 1);
    setHand([...hand, ...movedCard]);
    setLibrary(updatedDeck);
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
    if (library.length === undefined) return;
    if (e && e.dataTransfer) {
      e.target.style.opacity = "1";
      let dataID = e.dataTransfer.getData("Text").split("-");
      const zone = dataID[0];
      dataID = dataID[1];
      console.log("onBattlegroundDrop", zone);
      switch (zone) {
        case "deck":
          if (library.length === 0) return;
          const updatedDeck = [...library];
          let movedCard = updatedDeck.splice(0, 1);
          setCoordinates({
            ...coordinates,
            [movedCard[0].cardID]: { x: e.pageX - 70, y: e.pageY - 149 },
          });
          setField([...field, ...movedCard]);
          setLibrary(updatedDeck);
          break;

        case "hand":
          movedCard = hand.find((card) => card.cardID == dataID);
          const updatedHand = hand.filter(
            (card) => card.cardID !== movedCard.cardID
          );
          setCoordinates({
            ...coordinates,
            [dataID]: { x: e.pageX - 70, y: e.pageY - 149 },
          });
          setHand(updatedHand);
          setField([...field, movedCard]);
          break;

        case "field":
          movedCard = field.find((card) => card.cardID == dataID);
          setCoordinates({
            ...coordinates,
            [dataID]: { x: e.pageX - 70, y: e.pageY - 149 },
          });
          break;

        case "graveyard":
          const updatedGraveyard = [...graveyard];
          movedCard = updatedGraveyard.shift();
          setCoordinates({
            ...coordinates,
            [dataID]: { x: e.pageX - 70, y: e.pageY - 149 },
          });
          setGraveyard(updatedGraveyard);
          setField([...field, movedCard]);
          break;

        case "exiled":
          const updatedExiled = [...exiled];
          movedCard = updatedExiled.shift();
          setCoordinates({
            ...coordinates,
            [dataID]: { x: e.pageX - 70, y: e.pageY - 149 },
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
    if (!library.length) return;
    if (e && e.dataTransfer) {
      e.persist();
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
          const updatedDeck = [...library];
          movedCard = updatedDeck.splice(0, 1);
          hand.map((card, i) => {
            if (card.cardID == targetId) targetCardIndex = i;
          });
          updatedHand.splice(targetCardIndex, 0, ...movedCard);
          setHand(updatedHand);
          setLibrary(updatedDeck);
          break;

        case "hand":
          hand.map((card, i) => {
            if (card.cardID == dataID) {
              movedCard = card;
              currentCardIndex = i;
            }
            if (targetId === "") {
              targetCardIndex = hand.length;
            } else {
              if (card.cardID == targetId) {
                targetCardIndex = i;
              }
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

          if (targetId === "") {
            targetCardIndex = hand.length;
          } else {
            hand.map((card, i) => {
              if (card.cardID == targetId && targetId !== "") {
                targetCardIndex = i;
              }
            });
          }

          let updatedField = [...field];
          updatedField.splice(currentCardIndex, 1);
          updatedHand.splice(targetCardIndex, 0, movedCard);
          setField(updatedField);
          setHand(updatedHand);
          break;

        case "graveyard":
          const updatedGraveyard = [...graveyard];
          movedCard = updatedGraveyard.shift();
          if (targetId === "") {
            targetCardIndex = hand.length;
          } else {
            hand.map((card, i) => {
              if (card.cardID == targetId) {
                targetCardIndex = i;
              }
            });
          }
          updatedHand.splice(targetCardIndex, 0, movedCard);
          setGraveyard(updatedGraveyard);
          setHand(updatedHand);
          break;

        case "exiled":
          const updatedExiled = [...exiled];
          movedCard = updatedExiled.shift();
          if (targetId === "") {
            targetCardIndex = hand.length;
          } else {
            hand.map((card, i) => {
              if (card.cardID == targetId) {
                targetCardIndex = i;
              }
            });
          }
          updatedHand.splice(targetCardIndex, 0, movedCard);
          setExiled(updatedExiled);
          setHand(updatedHand);
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
      let updatedDeck = [...library];

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
          setLibrary(updatedDeck);
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
          setLibrary(updatedDeck);
          break;

        case "graveyard":
          const updatedGraveyard = [...graveyard];
          movedCard = updatedGraveyard.shift();
          updatedDeck.unshift(movedCard);
          setGraveyard(updatedGraveyard);
          setLibrary(updatedDeck);
          break;

        case "exiled":
          const updatedExiled = [...exiled];
          movedCard = updatedExiled.shift();
          updatedDeck.unshift(movedCard);
          setExiled(updatedExiled);
          setLibrary(updatedDeck);
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
          const updatedDeck = [...library];
          movedCard = updatedDeck.splice(0, 1);
          updatedGraveyard.unshift(movedCard[0]);
          setLibrary(updatedDeck);
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
          const updatedDeck = [...library];
          movedCard = updatedDeck.splice(0, 1);
          updatedExiled.unshift(movedCard[0]);
          setLibrary(updatedDeck);
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

  const handleDropdownSelection = (e) => {
    e.persist();
    const zone = e.target.dataset.id.split("-")[0];
    const cardID = e.target.dataset.id.split("-")[1];
    console.log("find data-id", zone, cardID);
    // const updatedDeck =
    let updatedDeck, movedCard, movedIndex;
    switch (zone) {
      case "deck":
        updatedDeck = [...library];
        library.map((card, i) => {
          if (card.cardID == cardID) {
            movedCard = card;
            movedIndex = i;
          }
        });
        updatedDeck.splice(movedIndex, 1);
        setLibrary(updatedDeck);
        break;
      case "graveyard":
        updatedDeck = [...graveyard];
        graveyard.map((card, i) => {
          if (card.cardID == cardID) {
            movedCard = card;
            movedIndex = i;
          }
        });
        updatedDeck.splice(movedIndex, 1);
        setGraveyard(updatedDeck);
        break;
      case "exiled":
        updatedDeck = [...exiled];
        exiled.map((card, i) => {
          if (card.cardID == cardID) {
            movedCard = card;
            movedIndex = i;
          }
        });
        updatedDeck.splice(movedIndex, 1);
        setExiled(updatedDeck);
        break;
      default:
        break;
    }

    const updatedHand = [...hand];
    updatedHand.push(movedCard);
    setHand(updatedHand);
  };

  const handlePopupClick = (e, cardID, direction) => {
    const updatedDeck = [...library];
    let updatedHand = [...hand];
    let movedCard, currentCardIndex;
    hand.map((card, i) => {
      if (card.cardID == cardID) {
        movedCard = card;
        currentCardIndex = i;
      }
    });
    if (direction === "top") {
      console.log("top", cardID);
      updatedHand.splice(currentCardIndex, 1);
      updatedDeck.unshift(movedCard);
    } else {
      console.log("bottom", cardID);
      updatedHand.splice(currentCardIndex, 1);
      updatedDeck.push(movedCard);
    }
    setHand(updatedHand);
    setLibrary(updatedDeck);
  };

  const handeleUntapAll = () => {
    setUntapAll(!untapAll);
  };

  return (
    <div className="app">
      <NavBar />
      <div className="container-flex">
        <Battleground
          field={field}
          coordinates={coordinates}
          onDragOver={onDragOver}
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          onDrop={onBattlegroundDrop}
          untapAll={untapAll}
        />
        <Commands
          shuffle={shuffle}
          findCardByName={findCardByName}
          getCardImages={getCardImages}
          drawCard={drawCard}
          newGame={newGame}
          deck={library}
          handleDropdownSelection={handleDropdownSelection}
          handeleUntapAll={handeleUntapAll}
          graveyard={graveyard}
          exiled={exiled}
        />
      </div>
      {library.length >= 0 && (
        <div className="container-flex">
          <Hand
            hand={hand}
            onDragOver={onDragOver}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onDrop={onHandDrop}
            handlePopupClick={handlePopupClick}
          />
          <div className="zones">
            <Deck
              drawCard={drawCard}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
              onDrop={onDeckDrop}
              deck={library}
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
