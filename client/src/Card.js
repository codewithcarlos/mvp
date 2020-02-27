import React from "react";

const Card = ({ card }) => {
  // console.log("card is", card);
  // const image =
  //   "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=3&type=card";
  // const name = "Black Lotus";
  return (
    <div>
      <img className="card-image" src={card.imageUrl} alt={card.name} />
    </div>
  );
};

export default Card;
