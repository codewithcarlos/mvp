import React from "react";
import { Popup } from "semantic-ui-react";
import { observer } from "mobx-react-lite";

const TableItem = ({ predicate, value, imageUrl }) => {
  return (
    <div>
      {predicate === "cardName" ? (
        <Popup
          trigger={<span className="table-card-name">{value}</span>}
          content={<img src={imageUrl} className="table-card-image" />}
          size="small"
          position="right center"
        />
      ) : (
        value
      )}
    </div>
  );
};

export default observer(TableItem);
