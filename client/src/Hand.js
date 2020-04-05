import React from "react";
import Card from "./Card";

const Hand = ({
  hand,
  handSize,
  onDragStart,
  onDrop,
  onDragOver,
  onDragEnd,
  handlePopupClick,
}) => {
  // console.log("hand rerendered", hand);
  return (
    <div
      className="hand"
      onDrop={(e) => onDrop(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnd={(e) => onDragEnd(e)}
    >
      {hand.map(
        (card, i) =>
          i < hand.length && (
            <Card
              card={card}
              key={i}
              i={i}
              onDragStart={(e) => onDragStart(e, "hand")}
              onDrop={onDrop}
              left={hand.length <= 7 ? 0 : (870 / hand.length) * i + 20 - i}
              position={hand.length <= 7 ? "relative" : "absolute"}
              handlePopupClick={handlePopupClick}
            />
          )
      )}
    </div>
  );
};

export default Hand;
