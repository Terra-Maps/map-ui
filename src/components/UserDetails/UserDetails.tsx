import React, { useContext } from "react";
import { StateContext } from "../../hooks";
import { IStateModel } from "../../model/hooks.model";
import "./UserDetails.scss";

function UserDetails() {
  const { user } = useContext<IStateModel>(StateContext);

  return (
    <div className="UserDetails">
      <h2>User Details</h2>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Account Name:</div>
        <div className="wallet-details-item-value">{user.accountName}</div>
      </div>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Name:</div>
        <div className="wallet-details-item-value">{user.name}</div>
      </div>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Username:</div>
        <div className="wallet-details-item-value">{user.username}</div>
      </div>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Algorand Address:</div>
        <div className="wallet-details-item-value">{user.permissions[0].chainAccount}</div>
      </div>
      {user.email && (
        <div className="wallet-details-item">
          <div className="wallet-details-item-title">Email:</div>
          <div className="wallet-details-item-value">{user.email}</div>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
