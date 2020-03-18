import React from "react";

const Commands = ({ shuffleDeck, findCardByName, getCardImages, drawCard }) => {
  return (
    <div className="commands">
      <button onClick={() => shuffleDeck()}>Shuffle</button>
      <button onClick={() => findCardByName()}>Find Card By Name</button>
      <button onClick={() => getCardImages()}>Get Card Images</button>
      <button onClick={() => drawCard()}>Draw Card</button>
    </div>
  );
};

export default Commands;
