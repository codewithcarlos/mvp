import React from "react";

const Graveyard = ({
  onDragStart,
  onDrop,
  onDragOver,
  onDragEnd,
  graveyard
}) => {
  return (
    <div
      className="graveyard-slot"
      onDragStart={e => onDragStart(e, "graveyard")}
      onDrop={e => onDrop(e)}
      onDragOver={e => onDragOver(e)}
      onDragEnd={e => onDragEnd(e)}
    >
      {graveyard.length === 0 ? (
        <div>Graveyard</div>
      ) : (
        <img
          src={graveyard[0].imageUrl}
          alt={graveyard[0].name}
          className="card-image"
          id="graveyard"
        />
      )}
    </div>
  );
};

export default Graveyard;
