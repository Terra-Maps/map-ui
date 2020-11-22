import React, {
  FC,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import "./VotingClaim.scss";
import IVotingClaimProps from "./model";
import { IActionModel, IStateModel } from "../../../../../../model/hooks.model";
import { ActionContext, StateContext } from "../../../../../../hooks";
import algosdk from "algosdk";
import config from "../../../../../../config";
import {
  base64ToHex,
  stringToUint,
  waitForConfirmation,
} from "../../../../../../utils";

const VotingClaim: FC<IVotingClaimProps> = ({
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

  const [userPOIData, setUserPOIData] = useState<any>();
  const componentIsMounted = useRef(true);

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
      return v["id"] === appID;
    });
    console.log("viewUserPOIData", JSON.stringify(res, undefined, 2));
    var obj = res[0]["key-value"];
    var bs64 = btoa(newGeohash);
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
    const data = str.substring(66, str.length).split("2d");
    arr = arr.concat(data);

    console.log("viewUserPOIData", arr);

    return arr;
  };

  const fetchUserPOIDataCallback = useCallback(async () => {
    try {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewPOIConfig, user]);

  const claimMoney = () => {
    if (!user) {
      const modal = {
        openModal: true,
        modalConfig: { type: "not-signed" },
      };
      toggleModal(modal);
    } else {
      setDecryptionFor("VOTE_CLAIM");

      const modal = {
        openModal: true,
        modalConfig: { type: "decrypt-wallet" },
      };
      toggleModal(modal);
    }
  };

  const startClaiming = async () => {
    const modal = {
      openModal: true,
      modalConfig: { type: "transaction-progress" },
    };
    toggleModal(modal);
    try {
      //  let newGeohash = addPaddingToGeohash(viewPOIConfig.gh)
      console.log(viewPOIConfig.gh.length, "viewPOIConfig.gh");
      const algodclient = new algosdk.Algodv2(
        config.algorand.TOKEN,
        config.algorand.BASE_SERVER,
        config.algorand.PORT
      );
      let params = await algodclient.getTransactionParams().do();
      let sender = user.wallet.address;
      const index = 13190639;

      console.log("hash");
      let appArgs = [
        stringToUint("withdraw"),
        stringToUint(viewPOIConfig.gh.replaceAll("o", "")),
      ];
      console.log("appArgs", "withdraw", viewPOIConfig.gh);
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
      const myAccount = algosdk.mnemonicToSecretKey(decryptedWalletPrivateKey);
      const rawSignedTxn = txn1.signTxn(myAccount.sk);
      let xtx = await algodclient.sendRawTransaction(rawSignedTxn).do();
      console.log("Transaction : " + xtx.txId);
      await waitForConfirmation(algodclient, xtx.txId);
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

  useEffect(() => {
    if (
      decryptionDone &&
      decryptionFor === "VOTE_CLAIM" &&
      decryptedWalletPrivateKey &&
      componentIsMounted.current
    ) {
      console.log("startClaiming");
      startClaiming();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decryptionDone, decryptedWalletPrivateKey]);

  useEffect(() => {
    return () => {
      componentIsMounted.current = false;
    };
  }, []);

  useEffect(() => {
    fetchUserPOIDataCallback();
  }, [fetchUserPOIDataCallback]);

  return (
    <div className="VotingClaim">
      <div className="view-poi-voting-claim-details">
        <h2>Claim your stake</h2>
        <div className="view-poi-voting-claim-duration">
          <label>Claim Stake Duration</label>
          <div className="view-poi-voting-claim-progress-container">
            <div
              className="view-poi-voting-claim-progress"
              style={{
                width: `${50}%`,
              }}
            ></div>
          </div>
          <div className="view-poi-voting-claim-progress-labels-container">
            <span>24 Hrs Left</span>
            <span>50% done</span>
          </div>
        </div>
        <div className="view-poi-voting-claim-button-container">
          <button onClick={claimMoney} className="claim-button">
            Claim
          </button>
        </div>
      </div>
    </div>
  );
};

export default VotingClaim;
