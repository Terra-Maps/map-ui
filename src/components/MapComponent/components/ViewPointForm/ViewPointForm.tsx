import React, { FC } from "react";
import { FiX } from "react-icons/fi";
import "./ViewPointForm.scss";
import IViewPointForm from "./model";
import { FaCheck, FaTimes, FaSyncAlt } from "react-icons/fa";

const ViewPointForm: FC<IViewPointForm> = ({
  viewPOIConfig,
  setShowLeftSideBar,
  setViewPOIConfig,
}) => {
  viewPOIConfig.vf = true;
  return (
    <div className="ViewPointForm">
      <div className="view-poi-container">
        <div className="view-poi-header">
          <h2>{viewPOIConfig.nm}</h2>
          <div
            className="close-button"
            onClick={(e) => {
              setShowLeftSideBar(false);
              setViewPOIConfig(null);
            }}
          >
            <FiX />
          </div>
        </div>
        <div className="view-poi-content">
          <div className="view-poi-content-item view-poi-content-status">
            {!viewPOIConfig.vf ? (
              <>
                <span className="poi-status-icon poi-unverified-icon">
                  <FaTimes />
                </span>
                <span>Un-Verified</span>
              </>
            ) : (
              <>
                <span className="poi-status-icon poi-verified-icon">
                  <FaCheck />
                </span>
                <span>Verified</span>
              </>
            )}
          </div>
          <div className="view-poi-content-item view-poi-content-type">
            {viewPOIConfig.tp}
          </div>
          <div className="view-poi-content-item view-poi-content-address">
            <div className="view-poi-content-item-label">Address</div>
            <div className="view-poi-content-item-value">
              {viewPOIConfig.ad}
            </div>
          </div>
          <div className="view-poi-content-item view-poi-content-description">
            <div className="view-poi-content-item-label">Description</div>
            <div className="view-poi-content-item-value">
              {viewPOIConfig.ds}
            </div>
          </div>
        </div>
        <div className="view-poi-voting-details">
          <h2>What do you think?</h2>
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
            <button className="voting-button correct-button">Correct</button>
            <button className="voting-button incorrect-button">
              Incorrect
            </button>
          </div>
          <div className="view-poi-voting-duration">
            <label>Voting Time</label>
            <div className="view-poi-voting-progress-container">
              <div
                className="view-poi-voting-progress"
                style={{
                  width: `${20}%`,
                }}
              ></div>
            </div>
            <div className="view-poi-voting-progress-labels-container">
              <span>
                24 Hrs Left
              </span>
              <span>50% done</span>
            </div>
          </div>
          <div className="view-poi-voting-salt">
            <label>Your Voting Secret Salt</label>
            <div className="view-poi-voting-salt-data">
              <div className="view-poi-voting-salt-value">JUICY$22</div>
              <div className="view-poi-voting-salt-reload">
                <FaSyncAlt />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPointForm;
