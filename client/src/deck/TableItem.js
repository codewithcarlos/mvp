import React from "react";
import { Popup } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

const TableItem = ({ predicate, value, imageUrl}) => {
  let element;
  if (predicate === "cardName") {
    element = (
      <a>
        <Popup
          trigger={<span className="table-card-name">{value}</span>}
          content={<img src={imageUrl} className="table-card-image" />}
          size="small"
          position="right center"
        />
      </a>
    );
  } else if (predicate === "manaCost" && value) {
    element = value.map((image, i) => {
      return image[0] === "." ? (
        <img src={image} className="col-mana-cost" key={i} />
      ) : (
        <div className="colorless-mana" key={i}>
          {image}
        </div>
      );
    });
  } else {
    element = value;
  }
  return <>{element}</>;
};

export default observer(TableItem);
