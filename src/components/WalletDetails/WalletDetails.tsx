import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../../hooks";
import { IStateModel } from "../../model/hooks.model";
import { ApiService } from "../../service";
import "./WalletDetails.scss";
import config from "../../config";
import algosdk from "algosdk";
import Lottie from "react-lottie";
import animationData from "../../assets/lottie/loading-hourglass-lottie.json";

function WalletDetails() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
  const { user } = useContext<IStateModel>(StateContext);
  const [algoUsdExPrice, setAlgoUsdExPrice] = useState<number>(0);
  const [walletInfo, setWalletInfo] = useState<any>();
  const [loadWalletInfo, setLoadWalletInfo] = useState<boolean>(true);

  useEffect(() => {
    setLoadWalletInfo(true);
    loadExPrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadExPrice = async () => {
    const algodclient = new algosdk.Algodv2(
      config.algorand.TOKEN,
      config.algorand.BASE_SERVER,
      config.algorand.PORT
    );
    const accountInfo = await algodclient
      .accountInformation(user.wallet.address)
      .do();
    setWalletInfo(accountInfo);
    const ex = await ApiService.getAlgoUsdExchange();
    const exPrice = ex.data.coin.price;
    console.log(exPrice);
    setAlgoUsdExPrice(exPrice);
    setLoadWalletInfo(false);
  };
  let algoBalance = 0;
  if (walletInfo) algoBalance = walletInfo.amount / 10 ** 6;

  return (
    <div className="WalletDetails">
      <h2>Wallet Details</h2>
      {!loadWalletInfo ? (
        <>
          <div className="wallet-details-item">
            <div className="wallet-details-item-title">Address:</div>
            <div className="wallet-details-item-value">
              {user.wallet.address}
            </div>
          </div>
          <div className="wallet-details-item">
            <div className="wallet-details-item-title">TRM Balance:</div>
            <div className="wallet-details-item-value">
              {algoBalance} TRM ($ {(algoBalance * algoUsdExPrice).toFixed(2)})
            </div>
          </div>
        </>
      ) : (
        <div className="loading-container">
          <Lottie options={defaultOptions} height={156} width={156} />
        </div>
      )}
    </div>
  );
}

export default WalletDetails;
