import React, { useState } from "react";
import Card from "./Card";

const Hand = ({ mainDeck }) => {
  const [count, setCount] = useState(7);
  let hand = [];
  for (let i = 0; i < count; i++) {
    hand.push(mainDeck[i]);
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
