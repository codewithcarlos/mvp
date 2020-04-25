import React from "react";
import ReactDOM from "react-dom";
import { Router } from "react-router-dom";
import { createBrowserHistory } from "history";

export const history = createBrowserHistory();

import PlaytestPage from "./playtest/PlaytestPage";
import Metagame from "./metagame/Metagame";
import DeckPage from "./deck/DeckPage";
import App from "./layout/App";
import "mobx-react-lite/batchingForReactDom";

ReactDOM.render(
  <Router history={history}>
    <App />
  </Router>,
  document.getElementById("root")
);
