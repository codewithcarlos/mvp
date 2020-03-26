import React from "react";
import Card from "./Card";

const Hand = ({ hand, handSize, onDragStart, onDrop, onDragOver, onDragEnd }) => {
  // console.log("hand rerendered", hand);
  return (
    <div
      className="hand"
      onDrop={e => onDrop(e)}
      onDragOver={e => onDragOver(e)}
      onDragEnd={e => onDragEnd(e)}
    >
      {hand.map(
        (card, i) =>
          i < handSize && (
            <Card
              card={card}
              key={i}
              i={i}
              onDragStart={onDragStart}
              onDrop={onDrop}
            />
          )
      )}
    </div>
  );
};

export default Hand;
