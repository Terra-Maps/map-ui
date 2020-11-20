import React, { useContext, useState } from "react";
import "./SignPassword.scss";
import { BeatLoader } from "react-spinners";
import PinInput from "react-pin-input";
import { IActionModel, IStateModel } from "../../../../model/hooks.model";
import { ActionContext, StateContext } from "../../../../hooks";
import algosdk from 'algosdk';
import { ApiService, CryptoService } from "../../../../service";

function SignPassword() {
  const { decryptedWalletPrivateKey } = useContext<IStateModel>(StateContext);
  const { toggleModal, fetchUser } = useContext<IActionModel>(ActionContext);
  const [walletPassword, setWalletPassword] = useState<string>("");
  const [walletLoader, setWalletLoader] = useState<boolean>(false);

  const signPrivateKey = async () => {
    setWalletLoader(true);
    console.log(walletPassword);
    const myAccount = algosdk.mnemonicToSecretKey(decryptedWalletPrivateKey)
    const encrypted = CryptoService.encryptData(decryptedWalletPrivateKey, walletPassword)
    const wallet = {
      address: myAccount.addr,
      passphrase: encrypted
    }
    await ApiService.walletUpdate(wallet);
    setWalletLoader(false);
    const modal = {
      openModal: false,
      modalConfig: { type: "" },
    };
    toggleModal(modal);
    fetchUser()
  };

  const onChange = (value: string) => {
    setWalletPassword(value);
  };

  return (
    <div className="PrivateKeySignIn">
      <div className="private-key-label">
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
      />
      <button
        className="private-key-button"
        type="button"
        onClick={signPrivateKey}
      >
        {walletLoader ? (
          <BeatLoader size={10} color={"#fff"} loading={true} />
        ) : (
          "Submit"
        )}
      </button>
    </div>
  );
}

export default SignPassword;
