import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ActionContext } from "../../hooks";
import { IActionModel } from "../../model/hooks.model";
import "./TransactionStatus.scss";

function TransactionStatus(props: any) {
  const { toggleModal } = useContext<IActionModel>(ActionContext);

  return (
    <div className="Signup">
      <h2>Your Transcation Was Sucessful</h2>
      <p className="misc-text">
        {props.action === "Vote" ? (
          <div>Your Vote Has Been Registered</div>
        ) : null}
        {props.action === "Reveal" ? (
          <div>You Have Revealed Your Vote</div>
        ) : null}
        {props.action === "Claim" ? (
          <div>You Have Claimed Your Stake Back</div>
        ) : null}
        {props.action === "Create" ? (
          <div>You Have Successfully Created the POI</div>
        ) : null}
      </p>
      <hr className="hor-line" />
    </div>
  );
}

export default TransactionStatus;
