import React, {
  FC,
  useEffect,
  useState,
  useContext,
  useCallback,
  useRef,
} from "react";
import "./VotingOngoing.scss";
import { FaSyncAlt } from "react-icons/fa";
import { randomStringGen } from "../../../../../../utils";
import IVotingOngoingProps from "./model";
import config from "../../../../../../config";
import algosdk from "algosdk";
import { IActionModel, IStateModel } from "../../../../../../model/hooks.model";

import { ActionContext, StateContext } from "../../../../../../hooks";
import { sha256 } from "js-sha256";
import { base64ToHex, waitForConfirmation } from "../../../../../../utils";

const VotingOngoing: FC<IVotingOngoingProps> = ({
  viewPOIConfig,
  poiCreationTime,
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

  const [voteSecretSalt, setVoteSecretSalt] = useState<string>("");
  const [userPOIData, setUserPOIData] = useState<any>();
  const [userVote, setUserVote] = useState<string>("");
  const [poiStakeAmount, setPoiStakeAmount] = useState<string>("");
  const componentIsMounted = useRef(true);

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
      return v["id"] === appID;
    });
    console.log("viewUserPOIData", JSON.stringify(res, undefined, 2));
    var obj = res[0]["key-value"];
    var bs64 = btoa(unPaddedGeohash);
    console.log("viewUserPOIData", "base", bs64, "geohash", geohash);
    const newObj = obj.filter(function (v: any) {
      return v["key"] === bs64;
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
      console.log(user.wallet.address);
      const response = await viewUserPOIData(
        user.wallet.address,
        13190639,
        viewPOIConfig.gh.replaceAll("o", "")
      );
      setUserPOIData(response);
      console.log("res", response);
    } catch (error) {
      console.log(error);
    }
  }, [viewPOIConfig, user]);

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
    setUserVote(vote);
    setDecryptionFor("VOTE_ONGOING");
    const modal = {
      openModal: true,
      modalConfig: { type: "decrypt-wallet" },
    };
    toggleModal(modal);
  };

  const startVoting = async () => {
    const modal = {
      openModal: true,
      modalConfig: { type: "transaction-progress" },
    };
    toggleModal(modal);
    try {
      //  let newGeohash = addPaddingToGeohash(viewPOIConfig.gh)
      let newGeohash = viewPOIConfig.gh.replaceAll("o", "");
      console.log(viewPOIConfig.gh.length, "viewPOIConfig.gh");
      const algodclient = new algosdk.Algodv2(
        config.algorand.TOKEN,
        config.algorand.BASE_SERVER,
        config.algorand.PORT
      );
      let params = await algodclient.getTransactionParams().do();
      let sender = user.wallet.address;
      const index = 13190639;

      const hash = sha256(userVote + voteSecretSalt).slice(0, 16);
      console.log("hash");
      let appArgs = [
        stringToUint("vote_poi"),
        stringToUint(newGeohash),
        stringToUint(hash),
      ];
      let appAccounts = [viewPOIConfig.creatorAddress];
      let txn1 = algosdk.makePaymentTxnWithSuggestedParams(sender, "4CU33PUGTXRRQQTPVW6LWE5M43XLKKPIV5ELJVNRK2AIAPTMKURU5DXY44", parseInt(poiStakeAmount), undefined, undefined, params);  

      let txn2 = algosdk.makeApplicationNoOpTxn(
        sender,
        params,
        index,
        appArgs,
        appAccounts
      );
      // Must be signed by the account sending the asset
      console.log(decryptedWalletPrivateKey);
      const myAccount = algosdk.mnemonicToSecretKey(decryptedWalletPrivateKey);
      try {
        let txnAppr: any = algosdk.makeApplicationOptInTxn(sender, params, index);
        let rawSignedApprTxn = txnAppr.signTxn(myAccount.sk);
        let opttx = await algodclient.sendRawTransaction(rawSignedApprTxn).do();
        console.log("Transaction : " + opttx.txId);
      } catch (error) {
        console.log(error)
      }
    

      params = await algodclient.getTransactionParams().do();
      
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
      saveSalt();
      fetchUserPOIDataCallback();
      setDecryptionFor(null);
      setWalletInfo("");
      setDecryptionDone(false);
      const modal = {
        openModal: true,
        modalConfig: { type: "transaction-done" },
      };
      toggleModal(modal);
    } catch (error) {
      console.log(error);
      setDecryptionFor(null);
      setWalletInfo("");
      setDecryptionDone(false);
      const modal = {
        openModal: true,
        modalConfig: { type: "transaction-failed" },
      };
      toggleModal(modal);
    }
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

  useEffect(() => {
    if (
      decryptionDone &&
      decryptionFor === "VOTE_ONGOING" &&
      decryptedWalletPrivateKey &&
      componentIsMounted.current
    ) {
      console.log("startVoting");
      startVoting();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptionDone, decryptedWalletPrivateKey]);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

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
        {/* {!walletAccount ? (
          <div className="view-poi-voting-button-options">
            <button className="voting-button correct-button">
              Login/Provide an Algorand Account
            </button>
          </div>
        ) :  */}
        {userPOIData ? (
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
                value={poiStakeAmount}
                onChange={(e) => setPoiStakeAmount(e.target.value)}
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
