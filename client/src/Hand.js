import React, { useState } from "react";
import Card from "./Card";

const Hand = ({ deckWithImages }) => {
  const [count, setCount] = useState(7);
  let hand = [];
  for (let i = 0; i < count; i++) {
    hand.push(deckWithImages[i]);
  }
  return (
    <div className="hand">
      {hand.map((card, i) => (
        <Card card={card} key={i} />
      ))}
    </div>
  );
};

export default Hand;
