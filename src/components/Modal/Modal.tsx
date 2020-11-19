import React, { useContext } from "react";
import "./Modal.scss";
import { StateContext, ActionContext } from "../../hooks";
import { IActionModel, IStateModel } from "../../model/hooks.model";
import { FiX } from "react-icons/fi";
import {
  Login,
  Signup,
  UserDetails,
  WalletConfiguration,
  WalletDetails,
} from "..";
import TransactionStatus from "../TransactionStatus";

function Modal() {
  const { toggleModal } = useContext<IActionModel>(ActionContext);
  const { openModal, modalConfig } = useContext<IStateModel>(StateContext);

  return (
    <div>
      <div
        className={`modal-overlay ${!openModal ? "closed" : null}`}
        id="modal-overlay"
        onClick={(e) => toggleModal({ openModal: false, modalConfig: {} })}
      ></div>

      <div className={`modal ${!openModal ? "closed" : null}`} id="modal">
        <button
          className="close-button"
          id="close-button"
          onClick={(e) => toggleModal({ openModal: false, modalConfig: {} })}
        >
          <FiX />
        </button>
        <div className="modal-guts">
          {modalConfig.type === "wallet" && <WalletConfiguration />}
          {modalConfig.type === "wallet-details" && <WalletDetails />}
          {modalConfig.type === "login" && <Login />}
          {modalConfig.type === "signup" && <Signup />}
          {modalConfig.type === "user-details" && <UserDetails />}
          {modalConfig.type === "transaction-done-vote" && (
            <TransactionStatus action="Vote" />
          )}
          {modalConfig.type === "transaction-done-reveal" && (
            <TransactionStatus action="Reveal" />
          )}
          {modalConfig.type === "transaction-done-withdraw" && (
            <TransactionStatus action="Claim" />
          )}
          {modalConfig.type === "transaction-done-create" && (
            <TransactionStatus action="Create" />
          )}
        </div>
      </div>
    </div>
  );
}

export default Modal;
