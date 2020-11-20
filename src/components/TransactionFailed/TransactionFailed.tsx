import React from "react";
import "./TransactionFailed.scss";
import Lottie from "react-lottie";
import animationData from "../../assets/lottie/failed-lottie.json";

function TransactionFailed() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="TransactionFailed">
      <Lottie options={defaultOptions} height={200} width={200} />
      <h2>Transaction failed</h2>
    </div>
  );
}

export default TransactionFailed;
