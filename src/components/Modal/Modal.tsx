import React, { useContext } from "react";
import "./Modal.scss";
import { StateContext, ActionContext } from "../../hooks";
import { IActionModel, IStateModel } from "../../model/hooks.model";
import { FiX } from "react-icons/fi";
import { Login, WalletConfiguration, WalletDetails } from "..";

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
        </div>
      </div>
    </div>
  );
}

export default Modal;
