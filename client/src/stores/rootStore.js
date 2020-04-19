
import { createContext } from 'react';
import PlaytestStore from './playtestStore';
import DeckStore from './deckStore';

export class RootStore {
  constructor() {
    this.playtestStore = new PlaytestStore(this);
    this.DeckStore = new DeckStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
