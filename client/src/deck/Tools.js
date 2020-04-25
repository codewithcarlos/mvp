import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Link } from "react-router-dom";
import { RootStoreContext } from "../stores/rootStore";

const Tools = () => {
  const rootStore = useContext(RootStoreContext);
  let { library, sideboard } = rootStore.DeckStore;
  const { newGame } = rootStore.playtestStore;
  library = Object.values(library);
  sideboard = Object.values(sideboard);

  return (
    <div className="commands">
      <button onClick={() => console.log("Buy from tcgplayer TODO")}>
        Buy from TCG Player
      </button>
      <Link to={{ pathname: `/playtest/1` }}>
        <button onClick={() => newGame(library, sideboard)}>Playtest</button>
      </Link>

      <button onClick={() => newGame()}>Download</button>
      <button onClick={() => newGame()}>Edit Deck</button>
    </div>
  );
};

export default observer(Tools);
