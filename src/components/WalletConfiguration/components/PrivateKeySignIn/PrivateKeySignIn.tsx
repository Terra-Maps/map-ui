import React, { useContext, useState } from "react";
import { ActionContext } from "../../../../hooks";
import { IActionModel } from "../../../../model/hooks.model";
import "./PrivateKeySignIn.scss";

function PrivateKeySignIn() {
  const { setWalletInfo } = useContext<IActionModel>(ActionContext);

  const [walletPrivateKey, setWalletPrivateKey] = useState("");

  return (
    <div className="PrivateKeySignIn">
      <div className="private-key-label">
        <label>Enter Private Key</label>
      </div>
      <textarea
        cols={30}
        rows={4}
        className="private-key-input"
        value={walletPrivateKey}
        onChange={(e) => setWalletPrivateKey(e.target.value)}
        placeholder="Algorand Private Key here"
      ></textarea>
      <button
        className="private-key-button"
        type="button"
        onClick={(e) => setWalletInfo(walletPrivateKey)}
      >
        Use this wallet
      </button>
    </div>
  );
}

export default PrivateKeySignIn;
