import React, { useState, useEffect } from "react";

const DraggableCard1 = ({
  card,
  indexCounter,
  setIndexCounter,
  coordinates,
  onDragStart,
  untapAll,
}) => {
  const [counter, setCounter] = useState(0);
  const [isRotated, setIsRotated] = useState(false);
  // console.log("draggablecard rerendered", card.cardID);

  useEffect(() => {
    setIsRotated(false);
  }, [untapAll]);

  const rotate = () => {
    setIsRotated(!isRotated);
  };

  const onStart = () => {
    const newCounter = indexCounter + 1;
    setIndexCounter(newCounter);
    setCounter(newCounter);
  };

  // const { card, i, coordinates } = this.props;
  let x, y;
  if (coordinates[card.cardID]) {
    x = coordinates[card.cardID].x;
    y = coordinates[card.cardID].y;
  } else {
    x = 0;
    y = 0;
  }
  // let { x, y } = coordinates[card.cardID];
  return (
    <div
      className="card"
      onMouseDown={onStart}
      onDragStart={(e) => onDragStart(e, "field")}
    >
      <div
        className="card-image-container"
        style={{
          zIndex: counter,
          left: x || 0,
          top: y || 0,
          position: "absolute",
        }}
      >
        <img
          src={card.imageUrl}
          alt={card.name}
          className={isRotated ? "card-image rotated" : "card-image"}
          onDoubleClick={rotate}
          id={card.cardID}
        />
      </div>
    </div>
  );
};

export default DraggableCard1;
