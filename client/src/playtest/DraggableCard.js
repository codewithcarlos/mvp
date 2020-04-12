import React, { useState, useEffect, useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from "mobx-react-lite";

const DraggableCard = ({ card, indexCounter, setIndexCounter }) => {
  const rootStore = useContext(RootStoreContext);
  const { coordinates, untapAll, onDragStart } = rootStore.playtestStore;
  const [counter, setCounter] = useState(0);
  const [isRotated, setIsRotated] = useState(false);
  console.log("draggablecard rerendered", card.cardID);

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
          id={card.cardID.toString()}
        />
      </div>
    </div>
  );
};

export default observer(DraggableCard);
