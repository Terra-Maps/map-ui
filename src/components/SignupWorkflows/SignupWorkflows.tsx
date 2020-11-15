import React from "react";
import "./SignupWorkflows.scss";
import { Route } from "react-router-dom";
import { GithubSignup, GithubCallback } from "./routes";

const SignupWorkflows = () => {
  return (
    <div className="SignupWorkflows">
      <Route path="/signup/github" exact render={() => <GithubSignup />} />
      <Route path="/callback/github" exact render={() => <GithubCallback />} />
    </div>
  );
};

export default SignupWorkflows;
