import React, { FC, useEffect, useState } from "react";
import "./VotingReveal.scss";
import IVotingRevealProps from "./model";
import { RadioGroup, Radio } from "react-radio-group";

const VotingReveal: FC<IVotingRevealProps> = ({ viewPOIConfig }) => {
  const [selectedVotingOption, setSelectedVotingOption] = useState<string>(
    "correct"
  );
  const [saltForReveal, setSaltForReveal] = useState<string>("");

  useEffect(() => {
    try {
      const saltInLocal = localStorage.getItem("salts");
      const saltsInLocalParsed = saltInLocal ? JSON.parse(saltInLocal) : {};
      const saltForGH = saltsInLocalParsed[viewPOIConfig.gh];
      setSaltForReveal(saltForGH ? saltForGH : "");
    } catch (err) {
      console.log(err);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewPOIConfig.gh]);

  return (
    <div className="VotingReveal">
      <div className="view-poi-voting-reveal-details">
        <h2>What did you vote? Reveal it!</h2>
        <div className="view-poi-voting-reveal-duration">
          <label>Reveal Vote Duration</label>
          <div className="view-poi-voting-reveal-progress-container">
            <div
              className="view-poi-voting-reveal-progress"
              style={{
                width: `${50}%`,
              }}
            ></div>
          </div>
          <div className="view-poi-voting-reveal-progress-labels-container">
            <span>24 Hrs Left</span>
            <span>50% done</span>
          </div>
        </div>
        <div className="view-poi-voting-reveal-salt">
          <label>Your voting secret salt</label>
          <input
            type="text"
            className="view-poi-voting-reveal-salt-input"
            placeholder="Enter your secret salt"
            value={saltForReveal}
            onChange={(e) => setSaltForReveal(e.target.value)}
          />
        </div>
        <div className="view-poi-voting-reveal-options-container">
          <label>Your vote</label>
          <RadioGroup
            name="vote"
            className="view-poi-voting-reveal-options"
            selectedValue={selectedVotingOption}
            onChange={(value) => setSelectedVotingOption(value)}
          >
            <label className="view-poi-voting-reveal-option">
              <Radio value="correct" />
              Correct
            </label>
            <label className="view-poi-voting-reveal-option">
              <Radio value="incorrect" />
              Incorrect
            </label>
          </RadioGroup>
        </div>
        <div className="view-poi-voting-reveal-button-container">
          <button className="reveal-button">Reveal</button>
        </div>
      </div>
    </div>
  );
};

export default VotingReveal;
