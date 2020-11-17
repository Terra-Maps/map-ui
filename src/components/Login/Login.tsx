import React from "react";
import "./Login.scss";

function Login() {

  const signInWithGithub = async () => {
    import("../../config").then((config: any) => {
      const githubSignInUrl = `${config.default.urls.BASE_URL}/signup/github`;
      window.open(githubSignInUrl, "_blank");
    });
  };

  return (
    <div className="Login">
      <h2>Login with</h2>
      <button className="wallet-button" onClick={signInWithGithub}>
        Github
      </button>
    </div>
  );
}

export default Login;
