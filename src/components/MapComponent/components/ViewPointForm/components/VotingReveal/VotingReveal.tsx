import React, { FC, useCallback, useContext, useEffect, useState } from "react";
import "./VotingReveal.scss";
import IVotingRevealProps from "./model";
import { RadioGroup, Radio } from "react-radio-group";
import { IActionModel, IStateModel } from "../../../../../../model/hooks.model";
import { ActionContext, StateContext } from "../../../../../../hooks";
import algosdk from "algosdk";
import config from "../../../../../../config";
import {
  base64ToHex,
  convertFromHex,
  stringToUint,
} from "../../../../../../utils";

const VotingReveal: FC<IVotingRevealProps> = ({
  viewPOIConfig,
  poiCreationTime,
  setShowLeftSideBar,
}) => {
  const { walletAccount } = useContext<IStateModel>(StateContext);
  const [selectedVotingOption, setSelectedVotingOption] = useState<string>(
    "yes"
  );
  const [userPOIData, setUserPOIData] = useState<any>();
  const [saltForReveal, setSaltForReveal] = useState<string>("");
  const [alreadyVoted, setAlreadyVoted] = useState<boolean>(false);
  const { toggleModal } = useContext<IActionModel>(ActionContext);

  const viewUserPOIData = async (account: string, appID: any, geohash: any) => {
    let newGeohash = viewPOIConfig.gh.replaceAll("o", "");
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
    var bs64 = btoa(newGeohash);
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
    const data = str.substring(66, str.length).split("2d");
    arr = arr.concat(data);

    console.log("viewUserPOIData", arr);

    return arr;
  };

  const fetchUserPOIDataCallback = useCallback(async () => {
    try {
      const response = await viewUserPOIData(
        walletAccount.addr,
        13172027,
        viewPOIConfig.gh.replaceAll("o", "")
      );
      setUserPOIData(response);

      const convertedVote = convertFromHex(response[1]);
      if (convertedVote === "yes" || convertedVote === "noo") {
        setAlreadyVoted(true);
      }
      console.log("res", response);
    } catch (error) {
      console.log(error);
    }
  }, [viewPOIConfig, walletAccount]);

  const revealVote = async () => {
    //  let newGeohash = addPaddingToGeohash(viewPOIConfig.gh)
    console.log(viewPOIConfig.gh.length, "viewPOIConfig.gh");
    const algodclient = new algosdk.Algodv2(
      config.algorand.TOKEN,
      config.algorand.BASE_SERVER,
      config.algorand.PORT
    );
    let params = await algodclient.getTransactionParams().do();
    let sender = walletAccount.addr;
    const index = 13172027;

    console.log("hash");
    let appArgs = [
      stringToUint("reveal_vote"),
      stringToUint(viewPOIConfig.gh.replaceAll("o", "")),
      stringToUint(selectedVotingOption),
      stringToUint(saltForReveal),
    ];
    console.log(
      "appArgs",
      "reveal_vote",
      viewPOIConfig.gh,
      selectedVotingOption,
      saltForReveal
    );
    let appAccounts = [
      viewPOIConfig.creatorAddress,
      viewPOIConfig.creatorAddress,
    ];
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
    setShowLeftSideBar();
    toggleModal({
      openModal: true,
      modalConfig: { type: "transaction-done-reveal" },
    });
  };

  useEffect(() => {
    fetchUserPOIDataCallback();
  }, [fetchUserPOIDataCallback]);

  useEffect(() => {
    try {
      const saltInLocal = localStorage.getItem("salts");
      console.log("saltInLocal", saltInLocal);

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
                width: `${
                  ((Math.floor(new Date().valueOf() / 1000) -
                    poiCreationTime +
                    259200) /
                    518400) *
                  100
                }%`,
              }}
            ></div>
          </div>
          <div className="view-poi-voting-reveal-progress-labels-container">
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
                ((Math.floor(new Date().valueOf() / 1000) -
                  poiCreationTime +
                  259200) /
                  518400) *
                  100
              )}
              % done
            </span>
          </div>
        </div>
        {alreadyVoted ? (
          <div>You have already Revealed your Vote</div>
        ) : userPOIData ? (
          <div>
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
                  <Radio value="yes" />
                  Correct
                </label>
                <label className="view-poi-voting-reveal-option">
                  <Radio value="noo" />
                  Incorrect
                </label>
              </RadioGroup>
            </div>
            <div className="view-poi-voting-reveal-button-container">
              <button onClick={revealVote} className="reveal-button">
                Reveal
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default VotingReveal;
