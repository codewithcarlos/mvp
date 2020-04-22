import React, { useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from "mobx-react-lite";
import TableSection from "./TableSection";

const DeckTable = () => {
  const rootStore = useContext(RootStoreContext);
  const { library, count, sideboard } = rootStore.DeckStore;

  return (
    <div className="deck-table">
      {!library ? (
        <span>Loading Deck</span>
      ) : (
        <table className="table-deck">
          <tbody>
            {count.Creature && (
              <tr>
                <td
                  colSpan="4"
                  className="col-type-header-creatures"
                >{`Creatures (${count.Creature.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Creature} />
            {count.Spells && (
              <tr>
                <td
                  colSpan="4"
                  className="col-type-header"
                >{`Instants and Sorceries (${count.Spells.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Spells} />
            {count.Planeswalker && (
              <tr>
                <td
                  colSpan="4"
                  className="col-type-header"
                >{`Planeswalkers (${count.Planeswalker.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Planeswalker} />
            {count.Artifact && (
              <tr>
                <td
                  colSpan="4"
                  className="col-type-header"
                >{`Artifacts (${count.Artifact.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Artifact} />
            {count.Enchantment && (
              <tr>
                <td
                  colSpan="4"
                  className="col-type-header"
                >{`Enchantments (${count.Enchantment.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Enchantment} />
            {count.Land && (
              <tr>
                <td
                  colSpan="4"
                  className="col-type-header"
                >{`Lands (${count.Land.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Land} />
            {count.Sideboard && (
              <tr>
                <td
                  colSpan="4"
                  className="col-type-header"
                >{`Sideboard (${count.Sideboard.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Sideboard} />
          </tbody>
        </table>
      )}
    </div>
  );
};

export default observer(DeckTable);
