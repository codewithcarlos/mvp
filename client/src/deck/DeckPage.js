import React, { useContext, useEffect } from "react";
import Gallery from "./Gallery";
import DeckSidebar from "./DeckSidebar";
import DeckTableView from "./DeckTableView";
import { RootStoreContext } from "../stores/rootStore";
import { observer } from "mobx-react-lite";
import mockDeck from "../playtest/mockDeck";

const DeckPage = () => {
  const rootStore = useContext(RootStoreContext);
  const { initializeDeckAndQueryString, fetchData } = rootStore.DeckStore;

  useEffect(() => {
    const newCount = {};
    const deckArr = mockDeck.trim().split("\n");
    const { postedDeck, queryString } = initializeDeckAndQueryString(deckArr);
    fetchData(newCount, postedDeck, queryString);
  }, []);

  return (
    <div id="deck-page">
      <div className="deck-content-container">
        <h1>Jund</h1>
        <Gallery />
        <DeckSidebar />
        <DeckTableView />
      </div>
    </div>
  );
};

export default observer(DeckPage);
