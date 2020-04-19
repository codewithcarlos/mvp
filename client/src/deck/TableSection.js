import React from "react";
import TableItem from "./TableItem";
import { observer } from "mobx-react-lite";

const TableSection = ({ section }) => {
  return (
    <>
      {section &&
        section.cards.map((card, i) => (
          <tr key={i}>
            {Object.entries(card)
              .filter((card) => {
                // console.log(card);
                return card[0] !== "imageUrl" && card[0] !== "cmc";
              })
              .map(([key, value], i) => {
                return (
                  <td key={i}>
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
