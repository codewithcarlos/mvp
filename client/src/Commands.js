import React from "react";

const Commands = (props) => {
  return (
    <div className="commands">
      <button onClick={() => props.shuffleDeck()}>Shuffle</button>
      <button onClick={() => props.findCardByName()}>Find Card By Name</button>
      <button onClick={() => props.getCardImages()}>Get Card Images</button>
      <button onClick={() => props.drawCard()}>Draw Card</button>
      <button onClick={() => props.newGame()}>New Game</button>
    </div>
  );
};

export default Commands;
