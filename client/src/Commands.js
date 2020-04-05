import React from "react";
import SearchDeck from "./SearchDeck";
import PopupExampleFlowing from "./Test";

const Commands = (props) => {
  return (
    <div className="commands">
      <button onClick={() => props.newGame()}>New Game</button>
      <SearchDeck
        deck={props.deck}
        handleDropdownSelection={props.handleDropdownSelection}
      />
      {/* <button onClick={() => props.findCardByName()}>Find Card By Name</button> */}
      <button onClick={() => props.shuffle(props.deck)}>Shuffle</button>
      <button onClick={() => props.drawCard()}>Draw Card</button>
    </div>
  );
};

export default Commands;
