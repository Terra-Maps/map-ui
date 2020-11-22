import React, { useContext, useEffect } from "react";
import Loading from "../Loading";
import "./SignCallback.scss";
// import { OreService } from "../../service";
import { useHistory } from "react-router-dom";
import { ActionContext } from "../../hooks";
import { IActionModel } from "../../model/hooks.model";

function SignCallback() {
  const history = useHistory();
  const { fetchUser } = useContext<IActionModel>(ActionContext);

  useEffect(() => {
    const signCallback = async () => {
      // const signedData = await OreService.handleSignCallbackService();
      // console.log(signedData, "signedDataStuff");
      history.push("/");
    };
    signCallback();
  }, [history, fetchUser]);

  return <Loading />;
}

export default SignCallback;
