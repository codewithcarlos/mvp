import React from "react";

const Card = ({ card }) => {
  // return <div>{card}</div>;
  const image =
    "http://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=3&type=card";
  const name = "Black Lotus"
  return (
    <div>
      <img className="card-image" src={image} alt={name} />
    </div>
  );
};

export default Card;
