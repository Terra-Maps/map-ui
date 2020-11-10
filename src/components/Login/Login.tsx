import React from "react";
import LoginButton from "oreid-login-button";
import "./Login.scss";
import config from "../../config";
import { OreService } from "../../service";


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
  textAlign: "center",
};

function Login() {
  

  const handleLogin = async (provider: any) => {
    let chainNetwork: any = config.algorand.ALGO_CHAIN_NETWORK;
    try {
      await OreService.loginUsingOreProvider(provider, chainNetwork)
    } catch (error) {
      console.log(error.message);
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
      <LoginButton
        provider="twitter"
        buttonStyle={loginButtonStyle}
        onClick={() => handleLogin("twitter")}
        text="Login with Twitter"
        logoStyle={{}}
      />
    </div>
  );
}

export default Login;
