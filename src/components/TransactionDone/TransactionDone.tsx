import React from "react";
import "./TransactionDone.scss";
import Lottie from "react-lottie";
import animationData from "../../assets/lottie/done-lottie.json";

function TransactionDone() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="TransactionDone">
      <Lottie options={defaultOptions} height={200} width={200} />
      <h2>Transaction done</h2>
    </div>
  );
}

export default TransactionDone;
