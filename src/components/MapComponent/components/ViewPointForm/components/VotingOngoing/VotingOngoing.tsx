import React, { FC, useEffect, useState, useContext } from "react";
import "./VotingOngoing.scss";
import { FaSyncAlt } from "react-icons/fa";
import { addPaddingToGeohash, randomStringGen } from "../../../../../../utils";
import IVotingOngoingProps from "./model";
import config from "../../../../../../config";
import algosdk from "algosdk";
import { IStateModel } from "../../../../../../model/hooks.model";

import { StateContext } from "../../../../../../hooks";
import { sha256 } from 'js-sha256';

const VotingOngoing: FC<IVotingOngoingProps> = ({ viewPOIConfig }) => {
  const { walletAccount } = useContext<IStateModel>(StateContext);
  const [voteSecretSalt, setVoteSecretSalt] = useState<string>("");

  useEffect(() => {
    const saltGen = randomStringGen(8);
    setVoteSecretSalt(saltGen);
  }, []);

  const generateNewSalt = () => {
    const saltGen = randomStringGen(8);
    setVoteSecretSalt(saltGen);
  };

  const votePOI = async (vote: string) => {
    //  let newGeohash = addPaddingToGeohash(viewPOIConfig.gh)
    let newGeohash = viewPOIConfig.gh
    console.log(viewPOIConfig.gh.length, 'viewPOIConfig.gh')
    const algodclient = new algosdk.Algodv2(
      config.algorand.TOKEN,
      config.algorand.BASE_SERVER,
      config.algorand.PORT
    );
    let params = await algodclient.getTransactionParams().do();
    let sender = walletAccount.addr;
    const index = 13089340

    const hash = sha256(vote + voteSecretSalt).slice(0,32)
    console.log('hash')
    let appArgs = [stringToUint("vote_poi"),stringToUint(newGeohash), stringToUint(hash)];
    let appAccounts = ['ARR6DJR4HAAORU6CFMY3MNRFIZQRXSDIFH2K2WVDFF7IFOB2OP7HKJWI2A']
    let txn1 = algosdk.makeApplicationNoOpTxn(sender,params,index, appArgs, ['ARR6DJR4HAAORU6CFMY3MNRFIZQRXSDIFH2K2WVDFF7IFOB2OP7HKJWI2A']);
    // Must be signed by the account sending the asset
    const rawSignedTxn = txn1.signTxn(walletAccount.sk);
    let xtx = await algodclient.sendRawTransaction(rawSignedTxn).do();
    console.log("Transaction : " + xtx.txId);
    saveSalt()
  }

  const saveSalt = () => {
    const saltInLocal = localStorage.getItem("salts");
    const saltInLocalParsed = saltInLocal ? JSON.parse(saltInLocal) : {};
    saltInLocalParsed[viewPOIConfig.gh] = voteSecretSalt;
    console.log(saltInLocalParsed);
    localStorage.setItem("salts", JSON.stringify(saltInLocalParsed));
  }

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
          <button className="voting-button correct-button" onClick={e => votePOI("yes")}>Correct</button>
          <button className="voting-button incorrect-button" onClick={e => votePOI("no")}>Incorrect</button>
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
