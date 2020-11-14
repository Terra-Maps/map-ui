import React, { useContext, useEffect } from "react";
import { Switch, Route } from "react-router-dom";
import "./App.scss";
import { AuthCallback, MapComponent, Modal } from "./components";
import { IActionModel } from "./model/hooks.model";
import { ActionContext } from "./hooks";
import SignCallback from "./components/SignCallback";

function App() {
  const { fetchUser } = useContext<IActionModel>(ActionContext);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="App">
      <Modal />
      <Switch>
        <Route path="/" exact render={() => <MapComponent />} />
        <Route path="/authcallback" exact render={() => <AuthCallback />} />
        <Route path="/signcallback" exact render={() => <SignCallback />} />
      </Switch>
    </div>
  );
}

export default App;
