import React, { useContext } from "react";
import { ActionContext } from "../../hooks";
import { IActionModel } from "../../model/hooks.model";
import "./Login.scss";

function Login() {
  const { toggleModal } = useContext<IActionModel>(ActionContext);

  const signInWithGithub = async () => {
    import("../../config").then((config: any) => {
      const githubSignInUrl = `${config.default.urls.BASE_URL}/signup/github`;
      window.open(githubSignInUrl, "_blank");
    });
  };

  const signInWithGoogle = async () => {
    import("../../config").then((config: any) => {
      const githubSignInUrl = `${config.default.urls.BASE_URL}/signup/google`;
      window.open(githubSignInUrl, "_blank");
    });
  };

  return (
    <div className="Login">
      <h2>Login with</h2>
      <button className="wallet-button" onClick={signInWithGithub}>
        <span className="login-icon-container">
          <img
            src={require("../../assets/png/github-icon.png")}
            alt="github-icon"
            className="login-icon"
          />
        </span>
        <span className="login-text">Github</span>
      </button>
      <button className="wallet-button" onClick={signInWithGoogle}>
        <span className="login-icon-container">
          <img
            src={require("../../assets/png/google-icon.png")}
            alt="google-icon"
            className="login-icon"
          />
        </span>
        <span className="login-text">Google</span>
      </button>
      <hr className="hor-line" />
      <p className="signup-text">
        Don't have an account?{" "}
        <span
          className="login-redirect-button"
          onClick={(e) =>
            toggleModal({
              openModal: true,
              modalConfig: { type: "signup" },
            })
          }
        >
          Signup here
        </span>{" "}
      </p>
    </div>
  );
}

export default Login;
