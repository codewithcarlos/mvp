import React, { useState } from "react";

const Card = ({ card, indexCounter, setIndexCounter, i, onDragStart }) => {
  const [position, setPostion] = useState({ left: 8 + 150 * i, top: 570 });
  // console.log("i", i);
  return (
    <div className="card" onDragStart={e => onDragStart(e)}>
      <div className="card-image-container">
        <img
          src={card.imageUrl}
          alt={card.name}
          className="card-image"
          id={i}
          // onMouseDown={add}
          // onMouseUp={remove}
          // onDoubleClick={rotate}
          // style={divStyle}
        />
      </div>
    </div>
  );
};

export default Card;
