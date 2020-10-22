import React from "react";
import "./WalletConfiguration.scss";

function WalletConfiguration() {

  return (
    <div className="WalletConfiguration">
      <h2>Manage Wallet</h2>
      <button className="wallet-button">Use Algosigner</button>
      <button className="wallet-button">Use Private Key</button>
      <p>Create a new wallet</p>
    </div>
  );
}

export default WalletConfiguration;
