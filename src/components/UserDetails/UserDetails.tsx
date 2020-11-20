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
        <div className="wallet-details-item-title">Name:</div>
        <div className="wallet-details-item-value">{user.provider_profile.name}</div>
      </div>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Username:</div>
        <div className="wallet-details-item-value">{user.provider_profile.username}</div>
      </div>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Algorand Address:</div>
        <div className="wallet-details-item-value">{user.wallet.address}</div>
      </div>
      {user.provider_profile.email && (
        <div className="wallet-details-item">
          <div className="wallet-details-item-title">Email:</div>
          <div className="wallet-details-item-value">{user.provider_profile.email}</div>
        </div>
      )}
    </div>
  );
}

export default UserDetails;
