import React, { useContext, useEffect, useRef, useState } from "react";
import { ActionContext } from "../../../../hooks";
import { IActionModel } from "../../../../model/hooks.model";
import "./PrivateKeySignIn.scss";
import { BeatLoader } from "react-spinners";

function PrivateKeySignIn() {
  const { setWalletInfo } = useContext<IActionModel>(ActionContext);

  const [walletPrivateKey, setWalletPrivateKey] = useState<string>(
    "derive scene gorilla attitude nation egg squirrel category crew concert hidden master obey ride lock immune rack vocal mesh member rude blossom dust about sand"
  );
  const [walletLoader, setWalletLoader] = useState<boolean>(false);

  const componentIsMounted = useRef(true);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  const loadWallet = async () => {
    setWalletLoader(true);
    await setWalletInfo(walletPrivateKey);
    if (componentIsMounted.current) {
      setWalletLoader(false);
    }
  };

  return (
    <div className="PrivateKeySignIn">
      <div className="private-key-label">
        <label>Enter Private Key</label>
      </div>
      <textarea
        cols={38}
        rows={4}
        className="private-key-input"
        value={walletPrivateKey}
        onChange={(e) => setWalletPrivateKey(e.target.value)}
        placeholder="Algorand Private Key here"
      ></textarea>
      <button className="private-key-button" type="button" onClick={loadWallet}>
        {walletLoader ? (
          <BeatLoader size={10} color={"#fff"} loading={true} />
        ) : (
          "Use this wallet"
        )}
      </button>
    </div>
  );
}

export default PrivateKeySignIn;
