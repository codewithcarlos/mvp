import React, { useContext } from "react";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from "mobx-react-lite";
import TableSection from "./TableSection";

const DeckTable = () => {
  const rootStore = useContext(RootStoreContext);
  const { deck, count } = rootStore.DeckStore;

  return (
    <div className="table-deck">
      {!deck ? (
        <span>Loading Deck</span>
      ) : (
        <table>
          <tbody>
            {count.Creature && (
              <tr>
                <td>{`Creatures (${count.Creature.count})`} </td>
              </tr>
            )}
            <TableSection section={count.Creature} />
            {(count.Instant || count.Sorcery) && (
              <tr>
                <td>{`Instants and Sorceries (${
                  (count.Instant.count || 0) + (count.Sorcery.count || 0)
                })`}</td>
              </tr>
            )}
            <TableSection section={count.Instant} />
            <TableSection section={count.Sorcery} />
            {count.Planeswalker && (
              <tr>
                <td>{`Planeswalkers (${count.Planeswalker.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Planeswalker} />
            {count.Artifact && (
              <tr>
                <td>{`Artifacts (${count.Artifact.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Artifact} />
            {count.Enchantment && (
              <tr>
                <td>{`Enchantments (${count.Enchantment.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Enchantment} />
            {count.Land && (
              <tr>
                <td>{`Lands (${count.Land.count})`}</td>
              </tr>
            )}
            <TableSection section={count.Land} />
          </tbody>
        </table>
      )}
    </div>
  );
};

export default observer(DeckTable);
