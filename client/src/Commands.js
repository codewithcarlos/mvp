import React from "react";
import Search from "./Search";

const Commands = (props) => {
  return (
    <div className="commands">
      <button onClick={() => props.newGame()}>New Game</button>
      <div className="search-library">
        <Search
          zone={props.deck}
          handleDropdownSelection={props.handleDropdownSelection}
          zoneId="deck"
        />
      </div>
      <button onClick={() => props.shuffle(props.deck)}>Shuffle</button>
      <button onClick={() => props.drawCard()}>Draw Card</button>
      <button onClick={() => props.handeleUntapAll()}>Untap All Cards</button>
      <div className="search-graveyard">
        <Search
          zone={props.graveyard}
          handleDropdownSelection={props.handleDropdownSelection}
          zoneId="graveyard"
        />
      </div>
      <Search
        zone={props.exiled}
        handleDropdownSelection={props.handleDropdownSelection}
        zoneId="exiled"
      />
    </div>
  );
};

export default Commands;
