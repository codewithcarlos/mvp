import React from "react";
import DeckCard from "./DeckCard";

const Metagame = () => {
  const decks = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  // console.log("rerendered metagame");
  return (
    <div id="metagame">
        {/* <Menu /> */}
        <h1>Modern Metagame</h1>
        <div className="metagame-deck-list">
          {decks.map((deck, i) => (
            <DeckCard deck={deck} key={i} />
          ))}
        </div>
    </div>
  );
};

export default Metagame;
