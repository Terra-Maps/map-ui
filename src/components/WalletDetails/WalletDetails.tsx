import React, { useContext, useEffect, useState } from "react";
import { StateContext } from "../../hooks";
import { IStateModel } from "../../model/hooks.model";
import { ApiService } from "../../service";
import "./WalletDetails.scss";

function WalletDetails() {
  const { walletAccount, walletInfo } = useContext<IStateModel>(StateContext);
  const [algoUsdExPrice, setAlgoUsdExPrice] = useState<number>(0);

  useEffect(() => {
    loadExPrice()
  }, [])

  const loadExPrice = async () => {
    const ex = await ApiService.getAlgoUsdExchange();
    const exPrice = ex.data.coin.price;
    console.log(exPrice);
    setAlgoUsdExPrice(exPrice);
  }

  const algoBalance = walletInfo.amount / 10 ** 6;


  return (
    <div className="WalletDetails">
      <h2>Wallet Details</h2>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Address:</div>
        <div className="wallet-details-item-value">{walletAccount.addr}</div>
      </div>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Algo Balance:</div>
        <div className="wallet-details-item-value">
          {algoBalance} ALGO ($ {(algoBalance * algoUsdExPrice).toFixed(2)})
        </div>
      </div>
      <div className="wallet-details-item">
        <div className="wallet-details-item-title">Terra Balance:</div>
        <div className="wallet-details-item-value">1000 TERRA</div>
      </div>
    </div>
  );
}

export default WalletDetails;
