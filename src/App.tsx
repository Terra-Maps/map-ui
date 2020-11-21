import React, { useContext, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import { Landing, MapComponent, Modal, SignupWorkflows } from "./components";
import { IActionModel } from "./model/hooks.model";
import { ActionContext } from "./hooks";
import { BroadcastChannel } from "broadcast-channel";

function App() {
  const { fetchUser } = useContext<IActionModel>(ActionContext);

  useEffect(() => {
    const bc = new BroadcastChannel("signin_channel");
    bc.onmessage = (msg) => {
      if (msg === "signedup") {
        fetchUser();
      }
    };
    return () => {
      bc.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const isJWTPresent = localStorage.getItem("jwt-token");
    if (isJWTPresent) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Modal />
      <Switch>
        <Route path="/" exact render={() => <Landing />} />
        <Route path="/map" exact render={() => <MapComponent />} />
        <Route path="/signup/:slug" exact render={() => <SignupWorkflows />} />
        <Route
          path="/callback/:slug"
          exact
          render={() => <SignupWorkflows />}
        />
      </Switch>
    </div>
  );
}

export default App;
