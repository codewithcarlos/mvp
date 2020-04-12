import React, { useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import Card from "./Card";
import { observer } from 'mobx-react-lite';

const Hand = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    hand,
    onHandDrop,
    onDragOver,
    onDragEnd,
  } = rootStore.playtestStore;
  console.log("hand rerendered", hand);
  return (
    <div
      className="hand"
      onDrop={(e) => onHandDrop(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnd={(e) => onDragEnd(e)}
    >
      {hand.map(
        (card, i) =>
          i < hand.length && (
            <Card
              card={card}
              key={i}
              left={hand.length <= 7 ? 0 : (870 / hand.length) * i + 20 - i}
              position={hand.length <= 7 ? "relative" : "absolute"}
            />
          )
      )}
    </div>
  );
};

export default observer(Hand);
