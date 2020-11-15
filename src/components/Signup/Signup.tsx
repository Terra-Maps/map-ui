import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { ActionContext } from "../../hooks";
import { IActionModel } from "../../model/hooks.model";
import "./Signup.scss";

function Signup() {
  const { toggleModal } = useContext<IActionModel>(ActionContext);
  
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
      <p className="misc-text">
        By clicking continue, you agree to our{" "}
        <Link to="/">Terms of Service</Link> and{" "}
        <Link to="/">Privacy Policy</Link>.
      </p>
      <hr className="hor-line" />
      <p className="login-text">
        Already have an account?{" "}
        <span
          className="login-redirect-button"
          onClick={(e) =>
            toggleModal({
              openModal: true,
              modalConfig: { type: "login" },
            })
          }
        >
          Log in
        </span>{" "}
      </p>
    </div>
  );
}

export default Signup;
