
import { createContext } from 'react';
import PlaytestStore from './playtestStore';

export class RootStore {
  constructor() {
    this.playtestStore = new PlaytestStore(this);
  }
}

export const RootStoreContext = createContext(new RootStore());
