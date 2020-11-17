import React, { FC } from "react";
import "./VotingClaim.scss";
import IVotingClaimProps from "./model";

const VotingClaim: FC<IVotingClaimProps> = ({
  viewPOIConfig,
  poiCreationTime,
}) => {
  return (
    <div className="VotingClaim">
      <div className="view-poi-voting-claim-details">
        <h2>Claim your stake</h2>
        <div className="view-poi-voting-claim-duration">
          <label>Claim Stake Duration</label>
          <div className="view-poi-voting-claim-progress-container">
            <div
              className="view-poi-voting-claim-progress"
              style={{
                width: `${50}%`,
              }}
            ></div>
          </div>
          <div className="view-poi-voting-claim-progress-labels-container">
            <span>24 Hrs Left</span>
            <span>50% done</span>
          </div>
        </div>
        <div className="view-poi-voting-claim-button-container">
          <button className="claim-button">Claim</button>
        </div>
      </div>
    </div>
  );
};

export default VotingClaim;
