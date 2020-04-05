import React, { useState } from "react";
import DraggableCard from "./DraggableCard";

const Battleground = ({
  field,
  coordinates,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  untapAll,
  // indexCounter,
  // setIndexCounter
}) => {
  const [indexCounter, setIndexCounter] = useState(0);
  // console.log("battleground rerendered");
  return (
    <div
      className="battleground"
      onDragStart={(e) => onDragStart(e, "field")}
      onDrop={(e) => onDrop(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnd={(e) => onDragEnd(e)}
    >
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
            untapAll={untapAll}
          />
        ))}
    </div>
  );
};

export default Battleground;
