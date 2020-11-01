import React, { FC } from "react";
import { FiX } from "react-icons/fi";
import "./ViewPointForm.scss";
import IViewPointFormProps from "./model";
import { FaCheck, FaTimes } from "react-icons/fa";
import { VotingClaim, VotingOngoing, VotingReveal } from "./components";

const ViewPointForm: FC<IViewPointFormProps> = ({
  viewPOIConfig,
  setShowLeftSideBar,
  setViewPOIConfig,
}) => {
  viewPOIConfig.vf = false;

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
        {!viewPOIConfig.vf && <VotingReveal viewPOIConfig={viewPOIConfig} />}
      </div>
    </div>
  );
};

export default ViewPointForm;
