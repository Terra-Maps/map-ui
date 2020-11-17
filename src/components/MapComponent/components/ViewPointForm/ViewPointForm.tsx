import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import "./ViewPointForm.scss";
import IViewPointFormProps from "./model";
import { FaCheck, FaTimes } from "react-icons/fa";
import { VotingClaim, VotingOngoing, VotingReveal } from "./components";
import { base64ToHex } from "../../../../utils";
import config from "../../../../config";
import algosdk from "algosdk";
import { IStateModel } from "../../../../model/hooks.model";
import { StateContext } from "../../../../hooks";

const ViewPointForm: FC<IViewPointFormProps> = ({
  viewPOIConfig,
  setShowLeftSideBar,
  setViewPOIConfig,
}) => {
  viewPOIConfig.vf = false;
  const { walletAccount } = useContext<IStateModel>(StateContext);
  const [POICreationTime, setPOICreationTime] = useState<any>();

  const fetchPOIDataCallback = useCallback(async () => {
    console.log("viewpOI ", viewPOIConfig.creatorAddress);
    const response = await fetchPOIData(
      viewPOIConfig.creatorAddress,
      13133763,
      viewPOIConfig.gh
    );
    console.log("res", response);
  }, [viewPOIConfig]);

  useEffect(() => {
    fetchPOIDataCallback();
  }, [walletAccount]);

  const fetchPOIData = async (account: string, appID: any, geohash: any) => {
    let unPaddedGeohash = geohash.replaceAll("o", "");
    let indexerClient = new algosdk.Indexer(
      config.algorand.TOKEN,
      config.algorand.INDEXER_SERVER,
      ""
    );
    let accountInfo = await indexerClient.lookupAccountByID(account).do();
    let value = accountInfo["account"]["apps-local-state"];
    let objects = new Array(...value);

    var res = objects.filter(function (v) {
      return v["id"] == appID;
    });
    console.log(JSON.stringify(res, undefined, 2));
    var obj = res[0]["key-value"];
    var bs64 = btoa(unPaddedGeohash);
    console.log("base", bs64, "geohash", geohash);
    const newObj = obj.filter(function (v: any) {
      return v["key"] == bs64;
    });
    console.log("newObj", newObj);
    const creationTime = getepoch(newObj[0].value.bytes);
    setPOICreationTime(creationTime);
    return res;
  };

  const getepoch = (str: string) => {
    str = base64ToHex(str);
    console.log(str);
    var arr = str.split("2d");
    console.log(arr);
    var epochHex = "0x" + arr[4];
    var epoch = parseInt(epochHex);
    console.log(epoch + "hex:" + epochHex);

    return epoch;
  };

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
        {!viewPOIConfig.vf && POICreationTime < POICreationTime + 259200 ? (
          <VotingOngoing
            viewPOIConfig={viewPOIConfig}
            poiCreationTime={POICreationTime}
          />
        ) : null}
        {!viewPOIConfig.vf &&
        POICreationTime > POICreationTime + 259200 &&
        POICreationTime < POICreationTime + 518400 ? (
          <VotingReveal
            viewPOIConfig={viewPOIConfig}
            poiCreationTime={POICreationTime}
          />
        ) : null}
        {!viewPOIConfig.vf &&
        POICreationTime > POICreationTime + 518400 &&
        POICreationTime < POICreationTime + 777600 ? (
          <VotingClaim
            viewPOIConfig={viewPOIConfig}
            poiCreationTime={POICreationTime}
          />
        ) : null}
      </div>
    </div>
  );
};

export default ViewPointForm;
