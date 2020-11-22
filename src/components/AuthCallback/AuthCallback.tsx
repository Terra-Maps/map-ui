import React, { useContext, useEffect } from "react";
import Loading from "../Loading";
import "./AuthCallback.scss";
// import { OreService } from "../../service";
import { useHistory } from "react-router-dom";
import { ActionContext } from "../../hooks";
import { IActionModel } from "../../model/hooks.model";


function AuthCallback() {
  const history = useHistory();
  const { fetchUser } = useContext<IActionModel>(ActionContext);


  useEffect(() => {
    const authCallback = async () => {
      // const userInfo = await OreService.handleAuthCallback();
      // console.log(userInfo, 'userInfo');
      // if(userInfo) {
        // fetchUser(userInfo)
      // }
      history.push("/");
    }
    authCallback()
  }, [history, fetchUser])

  
  return (
    <Loading />
  );
}

export default AuthCallback;
