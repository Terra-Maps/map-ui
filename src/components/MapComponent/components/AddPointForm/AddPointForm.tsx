import React, { FC, useContext, useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { FiX } from "react-icons/fi";
import { ActionContext, StateContext } from "../../../../hooks";
import { IActionModel, IStateModel } from "../../../../model/hooks.model";
import "./AddPointForm.scss";
import IAddPointForm from "./model";
import algosdk from "algosdk";
import config from "../../../../config";
import { BeatLoader } from "react-spinners";
// import Geohash from "latlon-geohash";
import { waitForConfirmation } from "../../../../utils";

const AddPointForm: FC<IAddPointForm> = ({
  addPOIConfig,
  setShowLeftSideBar,
  setAddPOIConfig,
  refreshMap,
}) => {
  const {
    user,
    decryptedWalletPrivateKey,
    decryptionDone,
    decryptionFor,
  } = useContext<IStateModel>(StateContext);
  const {
    toggleModal,
    setDecryptionFor,
    setDecryptionDone,
    setWalletInfo,
  } = useContext<IActionModel>(ActionContext);
  console.log("useruser", user);
  const [poiType, setPoiType] = useState<string>("Jaipur");
  const [poiName, setPoiName] = useState<string>("Jaipur");
  const [poiAddress, setPoiAddress] = useState<string>("Jaipur");
  const [poiDescription, setPoiDescription] = useState<string>("Jaipur");
  const [poiStakeAmount, setPoiStakeAmount] = useState<string>("233");
  const [addPoiLoader, setAddPoiLoader] = useState<boolean>(false);

  const componentIsMounted = useRef(true);

  const addPOI = () => {
    setDecryptionFor("ADD_POI");

    const modal = {
      openModal: true,
      modalConfig: { type: "decrypt-wallet" },
    };
    toggleModal(modal);
  };

  const startAddingPoi = async () => {
    const modal = {
      openModal: true,
      modalConfig: { type: "transaction-progress" },
    };
    toggleModal(modal);
    try {
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
      let sender = user.wallet.address;
      // const hexSender = convertToHex(sender);s
      const noteField = `terra-${newGeohash}-${sender}-${JSON.stringify(poi)}`;
      console.log(noteField, "noteField");
      var noteFieldUInt = stringToUint(noteField);
      const algodclient = new algosdk.Algodv2(
        config.algorand.TOKEN,
        config.algorand.BASE_SERVER,
        config.algorand.PORT
      );
      let params = await algodclient.getTransactionParams().do();
      const index = 13190639;
      let appArgs = [
        stringToUint("create_poi"),
        stringToUint(addPOIConfig.geohash),
      ];
      // let appArgsNormal = ["create_poi", addPOIConfig.geohash];
      console.log(poiStakeAmount);
      let txn1 = algosdk.makePaymentTxnWithSuggestedParams(sender, "4CU33PUGTXRRQQTPVW6LWE5M43XLKKPIV5ELJVNRK2AIAPTMKURU5DXY44", parseInt(poiStakeAmount), undefined, undefined, params);  
      let txn2 = algosdk.makeApplicationNoOpTxn(
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

      let appArgsNew: any = [];
      appArgs.forEach((arg: any) => {
        appArgsNew.push([...arg]);
      });

      let appArgsNewNormal: any = [];
      appArgs.forEach((arg: any) => {
        appArgsNewNormal.push(btoa(arg));
      });

      // let newNote: any = [];

      console.log("bufferArgs", appArgsNew);

      let txn = {
        type: "appl",
        from: sender,
        fee: params.minFee,
        firstRound: params.lastRound,
        lastRound: params.lastRound + 1000,
        genesisID: params.genesisId,
        genesisHash: params.genesisHash,
        appIndex: index,
        appOnComplete: 0,
        appArgs: appArgsNewNormal,
        appAccounts: undefined,
        appForeignApps: undefined,
        appForeignAssets: undefined,
        note: btoa(noteField),
        lease: undefined,
        reKeyTo: undefined,
      };

      const myAccount = algosdk.mnemonicToSecretKey(decryptedWalletPrivateKey);
      try {
        console.log("JSONApp", JSON.stringify(txn));
        let txnAppr: any = algosdk.makeApplicationOptInTxn(sender, params, index);
        let rawSignedApprTxn = txnAppr.signTxn(myAccount.sk);
        let opttx = await algodclient.sendRawTransaction(rawSignedApprTxn).do();
        console.log("Transaction : " + opttx.txId);
      } catch (error) {
        console.log(error)
      }
     

      params = await algodclient.getTransactionParams().do();

      //Must be signed by the account sending the asset
      let txns = [txn1, txn2]
      let txgroup = algosdk.assignGroupID(txns);
      let sg1 = txn1.signTxn(myAccount.sk)
      let sg2 = txn2.signTxn(myAccount.sk)
      let signed = []
      signed.push(sg1)
      signed.push(sg2)
      let xtx = await algodclient.sendRawTransaction(signed).do();
      console.log("Transaction : " + xtx.txId);
      await waitForConfirmation(algodclient, xtx.txId);
      setAddPoiLoader(false);
      setShowLeftSideBar(false);
      refreshMap();
      setAddPoiLoader(false);
      setShowLeftSideBar(false);
      setDecryptionFor(null);
      setWalletInfo("");
      setDecryptionDone(false);
      const modal2 = {
        openModal: true,
        modalConfig: { type: "transaction-done" },
      };
      toggleModal(modal2);
    } catch (err) {
      console.log(err);
      setAddPoiLoader(false);
      refreshMap();
      setDecryptionFor(null);
      setWalletInfo("");
      setDecryptionDone(false);
      const modal2 = {
        openModal: true,
        modalConfig: { type: "transaction-failed" },
      };
      toggleModal(modal2);
    }
  };

  function stringToUint(field: string) {
    const charList = field.split("");
    const uintArray = [];
    for (var i = 0; i < charList.length; i++) {
      uintArray.push(charList[i].charCodeAt(0));
    }
    return new Uint8Array(uintArray);
  }

  useEffect(() => {
    if (
      decryptionDone &&
      decryptionFor === "ADD_POI" &&
      decryptedWalletPrivateKey &&
      componentIsMounted.current
    ) {
      console.log("startAddingPoi");
      startAddingPoi();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptionDone, decryptedWalletPrivateKey]);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

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
            // disabled={!walletAccount}
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
