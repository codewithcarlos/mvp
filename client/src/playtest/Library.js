import React, {useContext} from "react";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from 'mobx-react-lite';

const Library = () => {
  const rootStore = useContext(RootStoreContext);
  const {
    drawCard,
    onDragStart,
    onLibraryDrop,
    onDragOver,
    onDragEnd,
    library,
  } = rootStore.playtestStore;
  // console.log('Library rerendered', library);
  return (
    <div
      id="deck"
      onClick={() => drawCard()}
      onDragStart={(e) => onDragStart(e, "deck")}
      onDrop={(e) => onLibraryDrop(e)}
      onDragOver={(e) => onDragOver(e)}
      onDragEnd={(e) => onDragEnd(e)}
    >
      {library.length === 0 ? (
        <div>Library</div>
      ) : (
        <img
          src="https://gamepedia.cursecdn.com/mtgsalvation_gamepedia/f/f8/Magic_card_back.jpg?version=0ddc8d41c3b69c2c3c4bb5d72669ffd7"
          alt="Back of Magic Card"
          className="card-image"
          id="library-img"
        />
      )}
    </div>
  );
};

export default observer(Library);
