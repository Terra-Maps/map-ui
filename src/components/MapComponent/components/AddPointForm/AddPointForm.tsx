import React, { FC, useContext, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { StateContext } from "../../../../hooks";
import { IStateModel } from "../../../../model/hooks.model";
import "./AddPointForm.scss";
import IAddPointForm from "./model";
import algosdk from "algosdk";
import config from "../../../../config";
import { BeatLoader } from "react-spinners";

const AddPointForm: FC<IAddPointForm> = ({
  addPOIConfig,
  setShowLeftSideBar,
  setAddPOIConfig,
  refreshMap,
}) => {
  const { walletAccount } = useContext<IStateModel>(StateContext);

  const [poiType, setPoiType] = useState<string>("road");
  const [poiName, setPoiName] = useState<string>("");
  const [poiAddress, setPoiAddress] = useState<string>("");
  const [poiDescription, setPoiDescription] = useState<string>("");
  const [poiStakeAmount, setPoiStakeAmount] = useState<string>("0");
  const [addPoiLoader, setAddPoiLoader] = useState<boolean>(false);

  const addPOI = async () => {
    setAddPoiLoader(true);
    const poi = {
      nm: poiName,
      gh: addPOIConfig.geohash,
      tp: poiType,
      ad: poiAddress,
      ds: poiDescription,
      st: poiStakeAmount,
    };
    console.log(poi)
    const noteField = `chikaara-${addPOIConfig.geohash}-${JSON.stringify(poi)}`;
    var noteFieldUInt = stringToUint(noteField);
    console.log(walletAccount, noteField);
    const algodclient = new algosdk.Algodv2(
      config.algorand.token,
      config.algorand.baseServer,
      config.algorand.port
    );
    let params = await algodclient.getTransactionParams().do();
    let sender = walletAccount.addr;
    let recipient = sender;
    let revocationTarget = undefined;
    let closeRemainderTo = undefined;
    let amount = 0;
    let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      sender,
      recipient,
      closeRemainderTo,
      revocationTarget,
      amount,
      noteFieldUInt,
      12743544,
      params
    );
    // Must be signed by the account sending the asset
    const rawSignedTxn = xtxn.signTxn(walletAccount.sk);
    let xtx = await algodclient.sendRawTransaction(rawSignedTxn).do();
    console.log("Transaction : " + xtx.txId);
    setAddPoiLoader(false);
    setShowLeftSideBar(false);
    refreshMap();
  };

  function stringToUint(field: string) {
    const charList = field.split("");
    const uintArray = [];
    for (var i = 0; i < charList.length; i++) {
      uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
  }

  return (
    <div className="AddPointForm">
      <div className="add-poi-form-container">
        <div className="add-poi-form-header">
          <h2>Add Point of Interest</h2>
          <div
            className="close-button"
            onClick={(e) => {
              setShowLeftSideBar(false);
              setAddPOIConfig(null);
            }}
          >
            <FiX />
          </div>
        </div>
        <div className="add-poi-form-sub-header">
          <label>Geohash:</label>
          <span>{addPOIConfig.geohash}</span>
        </div>
        <div className="add-poi-form-body">
          <div className="add-poi-form-body-item">
            <label>POI Type</label>
            <select
              className="add-poi-form-body-item-select"
              value={poiType}
              onChange={(e) => setPoiType(e.target.value)}
            >
              <option value="road">Road</option>
              <option value="building">Building</option>
              <option value="water">Water</option>
              <option value="place">Place name</option>
              <option value="address">Address</option>
              <option value="somethingelse">It's something else</option>
            </select>
            <span className="select-down-icon">
              <FaChevronDown />
            </span>
          </div>
          <div className="add-poi-form-body-item">
            <label>POI Name</label>
            <input
              type="text"
              className="add-poi-form-body-item-input"
              value={poiName}
              onChange={(e) => setPoiName(e.target.value)}
            />
          </div>
          <div className="add-poi-form-body-item">
            <label>POI Address</label>
            <input
              type="text"
              className="add-poi-form-body-item-input"
              value={poiAddress}
              onChange={(e) => setPoiAddress(e.target.value)}
            />
          </div>
          <div className="add-poi-form-body-item">
            <label>POI Description</label>
            <textarea
              cols={30}
              rows={4}
              className="add-poi-form-body-item-textarea"
              value={poiDescription}
              onChange={(e) => setPoiDescription(e.target.value)}
            ></textarea>
          </div>
          <div className="add-poi-form-body-item">
            <label>Stake Amount</label>
            <input
              type="number"
              className="add-poi-form-body-item-input"
              value={poiStakeAmount}
              onChange={(e) => setPoiStakeAmount(e.target.value)}
            />
          </div>
        </div>
        <div className="add-poi-form-footer">
          <button
            className="add-poi-button"
            disabled={!walletAccount}
            onClick={addPOI}
          >
            {addPoiLoader ? (
              <BeatLoader size={10} color={"#fff"} loading={true} />
            ) : (
              "Add POI"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPointForm;
