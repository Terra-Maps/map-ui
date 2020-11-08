import React from "react";
import LoginButton from "oreid-login-button";
import "./Login.scss";
import config from "../../config";
import { OreId } from "oreid-js";

const loginButtonStyle = {
  width: 500,
  fontSize: "1rem",
  fontWeight: "bold",
  height: 50,
  color: "#fff",
  backgroundColor: "#1b2737",
  outline: "none",
  cursor: "pointer",
  margin: "12px 0px",
  fontFamily: "Rubik, sans-serif",
  textAlign: "center"
}

function Login() {
  // intialize oreId
  const oreId = new OreId({
    appName: "ORE ID Algorand Sample App", // Your app name
    appId: process.env.REACT_APP_OREID_APP_ID || "",
    apiKey: process.env.OREID_API_KEY || "",
    serviceKey: "",
    oreIdUrl: process.env.REACT_APP_OREID_URL || "",
    authCallbackUrl: `http://localhost:3000/authcallback`,
    signCallbackUrl: `${window.location.origin}/signcallback`,
    backgroundColor: "3F7BC7",
  });

  const handleLogin = async (provider: any) => {
    let chainNetwork: any = config.algorand.ALGO_CHAIN_NETWORK;
    try {
      let loginResponse: any = await oreId.login({ provider });
      // if the login responds with a loginUrl, then redirect the browser to it to start the user's OAuth login flow
      let { isLoggedIn, account, loginUrl } = loginResponse;
      if (loginUrl) {
        // redirect browser to loginURL
        window.location = loginUrl;
      }
      console.log({ userInfo: { accountName: account }, isLoggedIn });
    } catch (error) {
      console.log({ errorMessage: error.message });
    }
  };

  return (
    <div className="Login">
      <h2>Login with</h2>
      <LoginButton
        provider="google"
        buttonStyle={loginButtonStyle}
        onClick={() => handleLogin("google")}
        text="Login with Google"
        logoStyle={{}}
      />
      <LoginButton
        provider="facebook"
        buttonStyle={loginButtonStyle}
        onClick={() => handleLogin("facebook")}
        text="Login with Facebook"
        logoStyle={{}}
      />
    </div>
  );
}

export default Login;
