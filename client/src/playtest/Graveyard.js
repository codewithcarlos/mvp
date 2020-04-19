import React, { useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from 'mobx-react-lite';

const Graveyard = ({}) => {
  const rootStore = useContext(RootStoreContext);
  const {
    onDragStart,
    onGraveyardDrop,
    onDragOver,
    onDragEnd,
    graveyard,
  } = rootStore.playtestStore;
  // console.log('graveyard zone rerendered');
  return (
    <div
      className="graveyard-slot"
      onDragStart={(e) => onDragStart(e, "graveyard")}
      onDrop={(e) => onGraveyardDrop(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnd={(e) => onDragEnd(e)}
    >
      {graveyard.length === 0 ? (
        <div>Graveyard</div>
      ) : (
        <img
          src={graveyard[0].imageUrl}
          alt={graveyard[0].name}
          className="card-image"
          id={graveyard[0].cardID.toString()}
        />
      )}
    </div>
  );
};

export default observer(Graveyard);
