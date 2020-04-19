import React from "react";
import ReactDOM from "react-dom";
import PlaytestPage from "./playtest/PlaytestPage";
import Metagame from "./metagame/Metagame";
import DeckPage from "./deck/DeckPage";
import "mobx-react-lite/batchingForReactDom";

ReactDOM.render(<DeckPage />, document.getElementById("root"));
