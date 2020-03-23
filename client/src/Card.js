import React from "react";

const Card = ({ card, onDragStart }) => {
  // console.log("card rerendered", card.cardID);
  return (
    <div className="card" onDragStart={e => onDragStart(e)}>
      <div className="card-image-container">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="card-image"
          id={card.cardID}
        />
      </div>
    </div>
  );
};

export default Card;
