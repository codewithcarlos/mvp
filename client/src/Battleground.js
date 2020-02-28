import React from "react";
import Drag from "./DraggableCard";

const Battleground = ({
  onDrop,
  onDragOver,
  onDragStart,
  indexCounter,
  setIndexCounter,
  field
}) => {
  return (
    <div
      id="battleground"
      onDrop={e => onDrop(event)}
      onDragOver={e => onDragOver(e)}
    >
      {field.map((card, i) => (
        <Drag
          card={card}
          key={i}
          i={i}
          onDragStart={onDragStart}
          indexCounter={indexCounter}
          setIndexCounter={setIndexCounter}
        />
      ))}
    </div>
  );
};

export default Battleground;
