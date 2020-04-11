import React, { useState } from "react";
import { Icon, Popup } from "semantic-ui-react";

const Card = ({ card, onDragStart, left, position, handlePopupClick }) => {
  const [showPopup, setShowPopup] = useState(false);
  // console.log("card rerendered", card.cardID);

  return (
    <div
      className="card-container"
      onMouseEnter={() => setShowPopup(true)}
      onMouseLeave={() => setShowPopup(false)}
      onDrag={() => setShowPopup(false)}
      style={{ left, position }}
    >
      <div className={showPopup ? "popup" : "popup hide"}>
        <button>
          <Popup
            content="Put card on top of library"
            trigger={
              <Icon
                name="arrow up"
                onClick={(e) => handlePopupClick(e, card.cardID, "top")}
              />
            }
            position="top center"
          />
        </button>
        <button>
          <Popup
            content="Put card on bottom of library"
            trigger={
              <Icon
                name="arrow down"
                onClick={(e) => handlePopupClick(e, card.cardID, "bottom")}
              />
            }
            position="top center"
          />
        </button>
      </div>
      <div className="card" onDragStart={(e) => onDragStart(e)}>
        <div className="card-image-container">
          <img
            src={card.imageUrl}
            alt={card.name}
            className="card-image"
            id={card.cardID}
          />
        </div>
      </div>
    </div>
  );
};

export default Card;
