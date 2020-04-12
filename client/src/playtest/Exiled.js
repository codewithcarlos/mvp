import React, { useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from 'mobx-react-lite';

const Exiled = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    onDragStart,
    onExiledDrop,
    onDragOver,
    onDragEnd,
    exiled,
  } = rootStore.playtestStore;
  console.log('exiled zone rerendered');
  return (
    <div
      className="exiled-slot"
      onDragStart={(e) => onDragStart(e, "exiled")}
      onDrop={(e) => onExiledDrop(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnd={(e) => onDragEnd(e)}
    >
      {exiled.length === 0 ? (
        <div>Exiled</div>
      ) : (
        <img
          src={exiled[0].imageUrl}
          alt={exiled[0].name}
          className="card-image"
          id={exiled[0].cardID.toString()}
        />
      )}
    </div>
  );
};

export default observer(Exiled);
