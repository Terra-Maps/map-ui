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
import Geohash from "latlon-geohash";
import {
  handleSignCallbackService,
  handleSignTransaction,
} from "../../../../service/OreService";
import { convertToHex } from "../../../../utils";

const AddPointForm: FC<IAddPointForm> = ({
  addPOIConfig,
  setShowLeftSideBar,
  setAddPOIConfig,
  refreshMap,
}) => {
  const { walletAccount, user } = useContext<IStateModel>(StateContext);
  console.log("useruser", user);
  const [poiType, setPoiType] = useState<string>("Jaipur");
  const [poiName, setPoiName] = useState<string>("Jaipur");
  const [poiAddress, setPoiAddress] = useState<string>("Jaipur");
  const [poiDescription, setPoiDescription] = useState<string>("Jaipur");
  const [poiStakeAmount, setPoiStakeAmount] = useState<string>("233");
  const [addPoiLoader, setAddPoiLoader] = useState<boolean>(false);

  const addPOI = async () => {
    // const { permissions } = user;
    // const permission = permissions[0];
    // let provider = permission.externalWalletType;

    // let { accountName } = user;
    // provider = provider || "oreid"; // default to ore id

    let newGeohash = addPOIConfig.geohash;
    setAddPoiLoader(true);
    console.log(addPOIConfig.geohash.length, "addPOIConfig.geohash");
    if (addPOIConfig.geohash.length < 12) {
      let geoLen = addPOIConfig.geohash.length;
      var paddingLen = 12 - geoLen;
      newGeohash = addPOIConfig.geohash + "o".repeat(paddingLen);
      console.log(newGeohash, "newGeohash");
    }
    const poi = {
      nm: poiName,
      gh: newGeohash,
      tp: poiType,
      ad: poiAddress,
      ds: poiDescription,
      st: poiStakeAmount,
    };
    console.log(poi);
    let sender = walletAccount.addr;
    const hexSender = convertToHex(sender);
    const noteField = `terra-${newGeohash}-${sender}-${JSON.stringify(poi)}`;
    console.log(noteField, "noteField");
    var noteFieldUInt = stringToUint(noteField);
    console.log(walletAccount, noteField);
    const algodclient = new algosdk.Algodv2(
      config.algorand.TOKEN,
      config.algorand.BASE_SERVER,
      config.algorand.PORT
    );
    let params = await algodclient.getTransactionParams().do();
    console.log(walletAccount, "walletAccount");
    const index = 13164862;
    let appArgs = [
      stringToUint("create_poi"),
      stringToUint(addPOIConfig.geohash),
    ];
    // let appArgsNormal = ["create_poi", addPOIConfig.geohash];

    let xtxn = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      index,
      appArgs,
      undefined,
      undefined,
      undefined,
      noteFieldUInt,
      undefined,
      undefined
    );

    // let appArgsNew: any = [];
    // appArgs.forEach((arg: any) => {
    //   appArgsNew.push([...arg]);
    // });

    // let appArgsNewNormal: any = [];
    // appArgs.forEach((arg: any) => {
    //   appArgsNewNormal.push(btoa(arg));
    // });

    // let newNote: any = [];

    // console.log("bufferArgs", appArgsNew);

    // let txn = {
    //   type: "appl",
    //   from: sender,
    //   fee: params.minFee,
    //   firstRound: params.lastRound,
    //   lastRound: params.lastRound + 1000,
    //   genesisID: params.genesisId,
    //   genesisHash: params.genesisHash,
    //   appIndex: index,
    //   appOnComplete: 0,
    //   appArgs: appArgsNewNormal,
    //   appAccounts: undefined,
    //   appForeignApps: undefined,
    //   appForeignAssets: undefined,
    //   note: btoa(noteField),
    //   lease: undefined,
    //   reKeyTo: undefined,
    // };

    // console.log("JSONApp", JSON.stringify(txn));

    // await handleSignTransaction(
    //   provider,
    //   accountName,
    //   permission.chainAccount,
    //   permission.chainNetwork,
    //   txn,
    //   user
    // );

    // Must be signed by the account sending the asset
    const rawSignedTxn = xtxn.signTxn(walletAccount.sk);
    let xtx = await algodclient.sendRawTransaction(rawSignedTxn).do();
    console.log("Transaction : " + xtx.txId);
    // setAddPoiLoader(false);
    // setShowLeftSideBar(false);
    refreshMap();
    setAddPoiLoader(false);
    setShowLeftSideBar(false);
  };

  function stringToUint(field: string) {
    const charList = field.split("");
    const uintArray = [];
    for (var i = 0; i < charList.length; i++) {
      uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
  }

  const handleSignCallback = async () => {
    const urlPath = `${window.location.origin}${window.location.pathname}`;
    if (urlPath === `${window.location.origin}/signcallback`) {
      await handleSignCallbackService();
    }
  };

  React.useEffect(() => {
    handleSignCallback();
  });

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
