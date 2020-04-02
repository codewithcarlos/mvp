import React from "react";

const Exiled = ({ onDragStart, onDrop, onDragOver, onDragEnd, exiled }) => {
  return (
    <div
      className="exiled-slot"
      onDragStart={e => onDragStart(e, "exiled")}
      onDrop={e => onDrop(e)}
      onDragOver={e => onDragOver(e)}
      onDragEnd={e => onDragEnd(e)}
    >
      {exiled.length === 0 ? (
        <div>Exiled</div>
      ) : (
        <img
          src={exiled[0].imageUrl}
          alt={exiled[0].name}
          className="card-image"
          id="exiled"
        />
      )}
    </div>
  );
};

export default Exiled;
