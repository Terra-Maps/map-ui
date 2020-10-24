import React, { useContext } from "react";
import { StateContext } from "../../hooks";
import { IStateModel } from "../../model/hooks.model";
import { ManageWallets, PrivateKeySignIn } from "./components";
import "./WalletConfiguration.scss";

function WalletConfiguration() {
  const { walletStep } = useContext<IStateModel>(StateContext);

  return (
    <div className="WalletConfiguration">
      <h2>Manage Wallet</h2>
      {walletStep === 0 && <ManageWallets />}
      {walletStep === 1 && <PrivateKeySignIn />}
    </div>
  );
}

export default WalletConfiguration;
