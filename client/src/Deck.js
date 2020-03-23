import React from "react";

const Deck = ({ drawCard, onDragStart }) => {
  return (
    <div id="deck" onClick={() => drawCard()} onDragStart={e => onDragStart(e)}>
      <img
        src="https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/f/f8/Magic_card_back.jpg?version=0ddc8d41c3b69c2c3c4bb5d72669ffd7"
        alt="Back of Magic Card"
        className="card-image"
        id="deck-img"
      />
    </div>
  );
};

export default Deck;
