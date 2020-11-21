import React, { useContext } from "react";
import { ActionContext } from "../../../../hooks";
import { IActionModel } from "../../../../model/hooks.model";
import "./ManageWallets.scss";
import algosdk from "algosdk";

function ManageWallets() {
  const { setWalletStep, setWalletInfo } = useContext<IActionModel>(
    ActionContext
  );

  const createNewWallet = () => {
    var keys = algosdk.generateAccount();
    var mnemonic = algosdk.secretKeyToMnemonic(keys.sk);
    console.log(mnemonic);
    setWalletInfo(mnemonic);
    setWalletStep(2);
  };

  return (
    <div className="ManageWallets">
      <button className="wallet-button" onClick={(e: any) => setWalletStep(1)}>
        Use Existing Account
      </button>
      <p onClick={createNewWallet}>Create a New Account</p>
    </div>
  );
}

export default ManageWallets;
