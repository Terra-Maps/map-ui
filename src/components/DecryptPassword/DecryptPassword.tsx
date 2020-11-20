import React, { useContext, useState } from "react";
import "./DecryptPassword.scss";
import { BeatLoader } from "react-spinners";
import PinInput from "react-pin-input";
import { IActionModel, IStateModel } from "../../model/hooks.model";
import { ActionContext, StateContext } from "../../hooks";
import { CryptoService } from "../../service";


function DecryptPassword() {
  let pin: any = null;
  const { user } = useContext<IStateModel>(StateContext);
  const { toggleModal, setWalletInfo, setDecryptionDone } = useContext<IActionModel>(ActionContext);

  const [walletPassword, setWalletPassword] = useState<string>("");
  const [walletLoader, setWalletLoader] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);

  const decryptWallet = async () => {
    setWalletLoader(true);
    console.log(JSON.parse(user.wallet.passphrase), walletPassword)
    const decryptedWallet = CryptoService.decryptData(user.wallet.passphrase, walletPassword);
    console.log(decryptedWallet);
    if(decryptedWallet) {
      setWalletInfo(decryptedWallet);
      setDecryptionDone(true);
      setWalletLoader(false);
      const modal = {
        openModal: false,
        modalConfig: { type: "" },
      }
      toggleModal(modal);
    } else {
      setPasswordError(true);
      setWalletLoader(false);
      setWalletPassword("");
      pin.clear();
    }
  };

  const onChange = (value: string) => {
    setWalletPassword(value);
  };

  return (
    <div className="DecryptPassword">
      <h2>Decrypt Wallet</h2>
      <div className="decrypt-password-label">
        <label>Enter Password</label>
      </div>
      <PinInput
        length={6}
        initialValue=""
        onChange={onChange}
        inputMode="text"
        type="custom"
        focus
        style={{
          padding: "1rem",
          width: "85%",
          display: "flex",
          justifyContent: "space-between",
        }}
        inputStyle={{
          borderColor: "#1b2737",
          borderWidth: 3,
          borderRadius: 6,
          fontSize: 18,
        }}
        inputFocusStyle={{ borderColor: "#a2c4ff" }}
        autoSelect={true}
        regexCriteria={/^[ A-Za-z0-9_@./#&+-]*$/}
        ref={p => (pin = p)}
      />
      {passwordError && <div className="password-error">
        Entered password is not correct! Please try again with the correct password
      </div>}
      <button className="decrypt-password-button" type="button" onClick={decryptWallet}>
        {walletLoader ? (
          <BeatLoader size={10} color={"#fff"} loading={true} />
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
}

export default DecryptPassword;
