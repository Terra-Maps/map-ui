import React, { useEffect } from "react";
import Loading from "../../../../../Loading";

const GoogleCallback = () => {
  useEffect(() => {
    signInWithGoogle();
  }, []);

  const signInWithGoogle = async () => {
    import("../../../../../../config").then((config: any) => {
      const googleSignInUrl = `${config.default.urls.API_URL}/auth/google`;
      window.open(googleSignInUrl, "_self");
    });
  };

  return <Loading />;
};

export default GoogleCallback;