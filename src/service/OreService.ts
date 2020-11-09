import { OreId } from "oreid-js";

// intialize oreId
const oreId = new OreId({
  appName: "ORE ID Algorand Sample App", // Your app name
  appId: process.env.REACT_APP_OREID_APP_ID || "",
  apiKey: process.env.OREID_API_KEY || "",
  serviceKey: "",
  oreIdUrl: process.env.REACT_APP_OREID_URL || "",
  authCallbackUrl: `http://localhost:3000/authcallback`,
  signCallbackUrl: `${window.location.origin}/signcallback`,
  backgroundColor: "3F7BC7",
});

export const loginUsingOreProvider = async (provider: any, chainNetwork: any) => {
  let loginResponse: any = await oreId.login({ provider, chainNetwork });
  // if the login responds with a loginUrl, then redirect the browser to it to start the user's OAuth login flow
  let { loginUrl } = loginResponse;
  if (loginUrl) {
    // redirect browser to loginURL
    window.location = loginUrl;
  }
};


export const handleAuthCallback = async () => {
    const { account, errors } = oreId.handleAuthResponse(window.location.href);
    if (!errors) {
      const userInfo = (await oreId.getUserInfoFromApi(account)) || {};
      return userInfo;
    }
    return;
}

export const loadUserAfterLogin = async () => {
    let userInfo = (await oreId.getUser()) || {};
    if(userInfo.accountName) return userInfo;
    return userInfo;
}

export const logoutOre = async () => {
    oreId.logout();
}