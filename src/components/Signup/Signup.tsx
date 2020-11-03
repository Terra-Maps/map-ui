import React from "react";
import "./Signup.scss";

function Signup() {
  const signInWithGithub = async () => {
    import("../../config").then((config: any) => {
      const githubSignInUrl = `${config.default.urls.BASE_URL}/signup/github`;
      window.open(githubSignInUrl, "_blank");
    });
  };
  return (
    <div className="Signup">
      <h2>Signup with</h2>
      <button className="wallet-button" onClick={signInWithGithub}>
        Github
      </button>
    </div>
  );
}

export default Signup;
