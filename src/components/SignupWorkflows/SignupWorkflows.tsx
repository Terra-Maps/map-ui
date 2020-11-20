import React from "react";
import "./SignupWorkflows.scss";
import { Route } from "react-router-dom";
import {
  GithubSignup,
  GithubCallback,
  GoogleSignup,
  GoogleCallback,
} from "./routes";

const SignupWorkflows = () => {
  return (
    <div className="SignupWorkflows">
      <Route path="/signup/github" exact render={() => <GithubSignup />} />
      <Route path="/callback/github" exact render={() => <GithubCallback />} />
      <Route path="/signup/google" exact render={() => <GoogleSignup />} />
      <Route path="/callback/google" exact render={() => <GoogleCallback />} />
    </div>
  );
};

export default SignupWorkflows;
