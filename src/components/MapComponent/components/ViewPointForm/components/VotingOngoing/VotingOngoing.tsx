import React, { FC, useEffect, useState, useContext, useCallback } from "react";
import "./VotingOngoing.scss";
import { FaSyncAlt } from "react-icons/fa";
import { addPaddingToGeohash, randomStringGen } from "../../../../../../utils";
import IVotingOngoingProps from "./model";
import config from "../../../../../../config";
import algosdk from "algosdk";
import { IStateModel } from "../../../../../../model/hooks.model";

import { StateContext } from "../../../../../../hooks";
import { sha256 } from "js-sha256";
import { base64ToHex } from "../../../../../../utils";

const VotingOngoing: FC<IVotingOngoingProps> = ({
  viewPOIConfig,
  poiCreationTime,
}) => {
  const { walletAccount } = useContext<IStateModel>(StateContext);
  const [voteSecretSalt, setVoteSecretSalt] = useState<string>("");
  const [userPOIData, setUserPOIData] = useState<any>();

  const viewUserPOIData = async (account: string, appID: any, geohash: any) => {
    let unPaddedGeohash = geohash;
    let indexerClient = new algosdk.Indexer(
      config.algorand.TOKEN,
      config.algorand.INDEXER_SERVER,
      ""
    );
    let accountInfo;
    try {
      accountInfo = await indexerClient.lookupAccountByID(account).do();
    } catch (error) {
      console.log("eer", error);
    }
    let value = accountInfo["account"]["apps-local-state"];
    let objects = new Array(...value);

    var res = objects.filter(function (v) {
      return v["id"] == appID;
    });
    console.log("viewUserPOIData", JSON.stringify(res, undefined, 2));
    var obj = res[0]["key-value"];
    var bs64 = btoa(unPaddedGeohash);
    console.log("viewUserPOIData", "base", bs64, "geohash", geohash);
    const newObj = obj.filter(function (v: any) {
      return v["key"] == bs64;
    });
    console.log("viewUserPOIData", "newObj", newObj);
    const str = base64ToHex(newObj[0].value.bytes);
    console.log("viewUserPOIData", str);
    var arr = [];
    var creatorAdd = str.substring(0, 64);
    arr.push(creatorAdd);
    console.log("creatorAdd", creatorAdd);
    var data = str.substring(66, str.length).split("2d");
    console.log("data", data);
    arr = arr.concat(data);
    console.log("viewUserPOIData", arr);

    return arr;
  };

  const fetchUserPOIDataCallback = useCallback(async () => {
    try {
      const response = await viewUserPOIData(
        walletAccount.addr,
        13164862,
        viewPOIConfig.gh.replaceAll("o", "")
      );
      setUserPOIData(response);
      console.log("res", response);
    } catch (error) {
      console.log(error);
    }
  }, [viewPOIConfig, walletAccount]);

  useEffect(() => {
    const saltGen = randomStringGen(8);
    setVoteSecretSalt(saltGen);
  }, []);

  const generateNewSalt = () => {
    const saltGen = randomStringGen(8);
    setVoteSecretSalt(saltGen);
  };

  useEffect(() => {
    fetchUserPOIDataCallback();
  }, [fetchUserPOIDataCallback]);

  const votePOI = async (vote: string) => {
    //  let newGeohash = addPaddingToGeohash(viewPOIConfig.gh)
    let newGeohash = viewPOIConfig.gh.replaceAll("o", "");
    console.log(viewPOIConfig.gh.length, "viewPOIConfig.gh");
    const algodclient = new algosdk.Algodv2(
      config.algorand.TOKEN,
      config.algorand.BASE_SERVER,
      config.algorand.PORT
    );
    let params = await algodclient.getTransactionParams().do();
    let sender = walletAccount.addr;
    const index = 13164862;

    const hash = sha256(vote + voteSecretSalt).slice(0, 16);
    console.log("hash");
    let appArgs = [
      stringToUint("vote_poi"),
      stringToUint(newGeohash),
      stringToUint(hash),
    ];
    let appAccounts = [viewPOIConfig.creatorAddress];
    let txn1 = algosdk.makeApplicationNoOpTxn(
      sender,
      params,
      index,
      appArgs,
      appAccounts
    );
    // Must be signed by the account sending the asset
    const rawSignedTxn = txn1.signTxn(walletAccount.sk);
    let xtx = await algodclient.sendRawTransaction(rawSignedTxn).do();
    console.log("Transaction : " + xtx.txId);
    saveSalt();
    fetchUserPOIDataCallback();
  };

  const saveSalt = () => {
    const saltInLocal = localStorage.getItem("salts");
    const saltInLocalParsed = saltInLocal ? JSON.parse(saltInLocal) : {};
    saltInLocalParsed[viewPOIConfig.gh] = voteSecretSalt;
    console.log(saltInLocalParsed);
    localStorage.setItem("salts", JSON.stringify(saltInLocalParsed));
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
    <div className="VotingOngoing">
      <div className="view-poi-voting-details">
        <h2>What do you think?</h2>
        <div className="view-poi-voting-duration">
          <label>Voting Duration</label>
          <div className="view-poi-voting-progress-container">
            <div
              className="view-poi-voting-progress"
              style={{
                width: `${
                  ((Math.floor(new Date().valueOf() / 1000) - poiCreationTime) /
                    259200) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <div className="view-poi-voting-progress-labels-container">
            <span>
              {Math.floor(
                (poiCreationTime +
                  259200 -
                  Math.floor(new Date().valueOf() / 1000)) /
                  3600
              )}{" "}
              Hrs Left
            </span>
            <span>
              {Math.floor(
                ((Math.floor(new Date().valueOf() / 1000) - poiCreationTime) /
                  259200) *
                  100
              )}
              % done
            </span>
          </div>
        </div>
        {!walletAccount ? (
          <div className="view-poi-voting-button-options">
            <button className="voting-button correct-button">
              Login/Provide an Algorand Account
            </button>
          </div>
        ) : userPOIData ? (
          <div>You Have Already Voted</div>
        ) : (
          <div>
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
              <button
                className="voting-button correct-button"
                onClick={(e) => votePOI("yes")}
              >
                Correct
              </button>
              <button
                className="voting-button incorrect-button"
                onClick={(e) => votePOI("noo")}
              >
                Incorrect
              </button>
            </div>
          </div>
        )}

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
