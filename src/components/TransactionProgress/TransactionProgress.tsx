import React from "react";
import "./TransactionProgress.scss";
import Lottie from "react-lottie";
import animationData from "../../assets/lottie/loading-lottie.json";

function TransactionProgress() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="TransactionProgress">
      <Lottie options={defaultOptions} height={200} width={200} />
      <h2>Transaction in progress</h2>
    </div>
  );
}

export default TransactionProgress;
