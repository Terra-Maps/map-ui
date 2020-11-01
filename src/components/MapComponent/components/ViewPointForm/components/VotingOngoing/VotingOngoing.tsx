import React, { FC, useEffect, useState } from "react";
import "./VotingOngoing.scss";
import { FaSyncAlt } from "react-icons/fa";
import { randomStringGen } from "../../../../../../utils";
import IVotingOngoingProps from "./model";

const VotingOngoing: FC<IVotingOngoingProps> = ({ viewPOIConfig }) => {
  const [voteSecretSalt, setVoteSecretSalt] = useState<string>("");

  useEffect(() => {
    const saltGen = randomStringGen(8);
    setVoteSecretSalt(saltGen);
  }, []);

  const generateNewSalt = () => {
    const saltGen = randomStringGen(8);
    setVoteSecretSalt(saltGen);
  };

  const votePOI = (vote: string) => {
    const saltInLocal = localStorage.getItem("salts");
    const saltInLocalParsed = saltInLocal ? JSON.parse(saltInLocal) : {};
    saltInLocalParsed[viewPOIConfig.gh] = voteSecretSalt;
    console.log(saltInLocalParsed);
    localStorage.setItem("salts", JSON.stringify(saltInLocalParsed));
  }

  return (
    <div className="VotingOngoing">
      <div className="view-poi-voting-details">
        <h2>What do you think?</h2>
        <div className="view-poi-voting-duration">
          <label>Voting Duration</label>
          <div className="view-poi-voting-progress-container">
            <div
              className="view-poi-voting-progress"
              style={{
                width: `${50}%`,
              }}
            ></div>
          </div>
          <div className="view-poi-voting-progress-labels-container">
            <span>24 Hrs Left</span>
            <span>50% done</span>
          </div>
        </div>
        <div className="view-poi-voting-stake">
          <label>Stake Amount</label>
          <input
            type="number"
            className="view-poi-voting-stake-input"
            placeholder="Enter a stake amount"
            min={1}
            // value={poiStakeAmount}
            // onChange={(e) => setPoiStakeAmount(e.target.value)}
          />
        </div>
        <div className="view-poi-voting-button-options">
          <button className="voting-button correct-button" onClick={e => votePOI("correct")}>Correct</button>
          <button className="voting-button incorrect-button" onClick={e => votePOI("incorrect")}>Incorrect</button>
        </div>
        <div className="view-poi-voting-salt">
          <label>Your Voting Secret Salt</label>
          <div className="view-poi-voting-salt-data">
            <div className="view-poi-voting-salt-value">{voteSecretSalt}</div>
            <div
              className="view-poi-voting-salt-reload"
              onClick={generateNewSalt}
            >
              <FaSyncAlt />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VotingOngoing;
