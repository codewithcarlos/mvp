import React, { useState, useEffect } from "react";
import Card from "./Card";
// import Drag from "./Drag";

const Hand = ({
  deckWithImages,
  handSize,
  onDragStart,
  indexCounter,
  setIndexCounter
}) => {
  const [handTest, setHandTest] = useState(deckWithImages.slice(0, handSize));
  useEffect(() => {
    console.log("hand triggered");
    setHandTest(deckWithImages.slice(0, handSize));
  }, [deckWithImages, handSize]);
  return (
    <div className="hand">
      {handTest.map((card, i) => (
        // <Drag
        //   card={card}
        //   key={i}
        //   i={i}
        //   indexCounter={indexCounter}
        //   setIndexCounter={setIndexCounter}
        //   onDragStart={onDragStart}
        // />
        <Card
          card={card}
          key={i}
          i={i}
          indexCounter={indexCounter}
          setIndexCounter={setIndexCounter}
          onDragStart={onDragStart}
        />
      ))}
    </div>
  );
};

export default Hand;
