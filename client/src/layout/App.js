import React from "react";
import {
  Route,
  withRouter,
  RouteComponentProps,
  Switch,
} from "react-router-dom";
import { observer } from "mobx-react-lite";
import Metagame from "../metagame/Metagame";
import NavBar from "../playtest/NavBar";
import PlaytestPage from "../playtest/PlaytestPage";
import DeckPage from "../deck/DeckPage";

const App = () => {
  return (
    <div>
      <NavBar />
      <Route exact path="/" component={Metagame}></Route>
      <Route
        path={"/(.+)"}
        render={() => (
          <>
            <Switch>
              <Route exact path="/metagame" component={Metagame} />
              <Route strict path="/deck/:deckid" component={DeckPage} />
              <Route path="/playtest/:deckid" component={PlaytestPage} />
            </Switch>
          </>
        )}
      />
    </div>
  );
};

export default withRouter(observer(App));
