import React from "react";
import Card from "./Card";

const Hand = ({ deckWithImages, hand, handSize, onDragStart }) => {
  // console.log("hand rerendered", hand);
  return (
    <div className="hand">
      {hand.map(
        (card, i) =>
          i < handSize && (
            <Card card={card} key={i} i={i} onDragStart={onDragStart} />
          )
      )}
    </div>
  );
};

export default Hand;
