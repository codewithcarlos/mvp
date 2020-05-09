import React from "react";
import TableItem from "./TableItem";
import { observer } from "mobx-react-lite";

const TableSection = ({ section }) => {
  const classNames = {
    cardName: "card-name",
    cardQuantity: "card-quantity",
    manaCost: "mana-cost",
    cmc: "cmc",
    marketPrice: "card-price",
  };

  return (
    <>
      {section &&
        section.cards.map((card, i) => (
          <tr key={i}>
            {Object.entries(card)
              .filter((card) => {
                return card[0] !== "imageUrl" && card[0] !== "cmc";
              })
              .map(([key, value], i) => {
                return (
                  <td key={i} className={`col-${classNames[key]}`}>
                    <TableItem
                      predicate={key}
                      value={value}
                      imageUrl={card.imageUrl}
                    />
                  </td>
                );
              })}
          </tr>
        ))}
    </>
  );
};

export default observer(TableSection);
