import React, { useState, useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import DraggableCard from "./DraggableCard";
import { observer } from 'mobx-react-lite';

const Battleground = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    onDragOver,
    onBattlegroundDrop,
    onDragEnd,
    field,
  } = rootStore.playtestStore;
  const [indexCounter, setIndexCounter] = useState(0);
  console.log("battleground rerendered");
  return (
    <div
      className="battleground"
      onDrop={(e) => onBattlegroundDrop(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnd={(e) => onDragEnd(e)}
    >
      {field.length &&
        field.map((card, i) => (
          <DraggableCard
            card={card}
            key={i}
            indexCounter={indexCounter}
            setIndexCounter={setIndexCounter}
          />
        ))}
    </div>
  );
};

export default observer(Battleground);
