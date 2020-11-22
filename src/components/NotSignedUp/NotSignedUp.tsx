import React from "react";
import "./NotSignedUp.scss";
import Lottie from "react-lottie";
import animationData from "../../assets/lottie/user-lottie.json";

function NotSignedUp() {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="NotSignedUp">
      <img src={require("../../assets/png/log-in.svg")} alt="login" className="login-icon"/>
      <h2>Please login to interact with TerraMaps</h2>
    </div>
  );
}

export default NotSignedUp;
