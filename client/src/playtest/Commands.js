import React, { useContext } from "react";
import Search from "./Search";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from 'mobx-react-lite';

const Commands = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    newGame,
    library,
    handleDropdownSelection,
    shuffle,
    drawCard,
    handeleUntapAll,
    graveyard,
    exiled,
  } = rootStore.playtestStore;
  console.log('commands rerendered');
  return (
    <div className="commands">
      <button onClick={() => newGame()}>New Game</button>
      <div className="search-library">
        <Search
          zone={library}
          handleDropdownSelection={handleDropdownSelection}
          zoneId="deck"
        />
      </div>
      <button onClick={() => shuffle(library)}>Shuffle</button>
      <button onClick={() => drawCard()}>Draw Card</button>
      <button onClick={() => handeleUntapAll()}>Untap All Cards</button>
      <div className="search-graveyard">
        <Search
          zone={graveyard}
          handleDropdownSelection={handleDropdownSelection}
          zoneId="graveyard"
        />
      </div>
      <Search
        zone={exiled}
        handleDropdownSelection={handleDropdownSelection}
        zoneId="exiled"
      />
    </div>
  );
};

export default observer(Commands);
