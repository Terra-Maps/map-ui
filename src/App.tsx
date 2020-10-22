import React from "react";
import "./App.scss";
import { MapComponent, Modal } from "./components";

function App() {
  return (
    <div className="App">
      <Modal />
      <MapComponent />
    </div>
  );
}

export default App;
