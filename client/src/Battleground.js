import React, { useState } from "react";
import DraggableCard from "./DraggableCard";

const Battleground = ({
  onDrop,
  onDragOver,
  field,
  coordinates,
  onDragStart,
  onDragEnd
}) => {
  const [indexCounter, setIndexCounter] = useState(0);
  // console.log("battleground rerendered");
  return (
    <div
      id="battleground"
      onDrop={e => onDrop(e)}
      onDragOver={e => onDragOver(e)}
      onDragEnd={e => onDragEnd(e)}
    >
      <div className="bg-container">
        {field.length &&
          field.map((card, i) => (
            <DraggableCard
              card={card}
              key={i}
              i={i}
              indexCounter={indexCounter}
              setIndexCounter={setIndexCounter}
              coordinates={coordinates}
              onDragStart={onDragStart}
            />
          ))}
      </div>
    </div>
  );
};

export default Battleground;
