import React, { useContext } from "react";
import { ActionContext } from "../../../../hooks";
import { IActionModel } from "../../../../model/hooks.model";
import "./ManageWallets.scss";

function ManageWallets() {
  const { setWalletStep } = useContext<IActionModel>(ActionContext);

  return (
    <div className="ManageWallets">
      <button className="wallet-button" onClick={(e: any) => setWalletStep(1)}>
        Use Private Key
      </button>
      <p>Create a new wallet</p>
    </div>
  );
}

export default ManageWallets;
