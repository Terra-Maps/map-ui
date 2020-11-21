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

export const loginUsingOreProvider = async (
  provider: any,
  chainNetwork: any
) => {
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
};

export const loadUserAfterLogin = async () => {
  let userInfo = (await oreId.getUser()) || {};
  if (userInfo.accountName) return userInfo;
  return userInfo;
};

export const logoutOre = async () => {
  oreId.logout();
};

export const handleSignCallbackService = async () => {
  const signResponse = await oreId.handleSignResponse(window.location.href);
  const { signedTransaction, state, transactionId, errors } = signResponse;
  if (!errors) {
    return [signedTransaction, state, transactionId];
  } else {
    console.log("error", errors);
  }
};

export const handleSignTransaction = async (
  provider: any,
  account: any,
  chainAccount: any,
  chainNetwork: any,
  transaction: any,
  user: any
) => {
  // wrap transaction in actions array for oreid

  console.log("transaction", transaction);
  try {
    if (provider === "oreid") {
      transaction = {
        actions: [transaction],
      };
    }

    // const multiSigChainAccounts = getMultisigChainAccountsForTransaction(
    //   user,
    //   chainAccount
    // );

    let signOptions = {
      provider: provider || "", // wallet type (e.g. 'algosigner' or 'oreid')
      account: account || "",
      broadcast: true, // if broadcast=true, ore id will broadcast the transaction to the chain network for you
      chainAccount: chainAccount || "",
      chainNetwork: chainNetwork || "",
      state: "abc", // anything you'd like to remember after the callback
      transaction,
      returnSignedTransaction: true,
      preventAutoSign: true, // prevent auto sign even if transaction is auto signable
      //multiSigChainAccounts,
    };

    console.log("signOptions", signOptions);

    let signResponse: any = await oreId.sign(signOptions);
    console.log(signResponse, "signResponse");
    // if the sign responds with a signUrl, then redirect the browser to it to call the signing flow
    // let { signUrl } = signResponse;
    // if (signUrl) {
    //   // redirect browser to signUrl
    //   window.location = signUrl;
    // }
  } catch (error) {
    console.log(error);
  }
};

/**
 * Returns the multisig metadata for a specific ORE ID account (if it exists)
 */
export const getMultisigMetadata = (userInfo: any, chainAccount: any) => {
  const chainAccountInfo = userInfo?.permissions?.find(
    (permission: any) => permission.chainAccount === chainAccount
  );
  return chainAccountInfo?.metadata?.algorandMultisig;
};

/**
 * Returns comma seperated list of chainAccounts required for the multsig transaction
 * ORE ID will add signatures to the transaction for all these accounts
 *
 * For an Algorand multisig account created by OREID, the user has two Algorand addresses in use..
 * 1) Multisig 'Asset Account' address - the address which is the hash of all the multisig metadata - this address is the target of the transaction
 * 2) 'Key Account` address - the address for which the user controls the private key with his ORE ID account - it is one of the signing parties to the multisig transaction
 *
 * When ORE ID signs an multisig transaction, it attaches the user's signaure from his KeyAccount (after he enters his PIN on the sign UX)
 * It then attaches the signatures for all the other accounts/addresses included in this comma-seperated list - ORE ID must manage the private keys for these other accounts
 *
 * Which accounts compose the multisig transaction MUST be decided by the app developer prior to ORE ID creating multisig acconts for users
 */
export const getMultisigChainAccountsForTransaction = (
  userInfo: any,
  chainAccount: any
) => {
  const algorandMultisig = getMultisigMetadata(userInfo, chainAccount);
  const requiredAccountsForMultiSigTransaction = []; // put list of signatures required to sign here
  if (!algorandMultisig) return "";
  const keyAccount = userInfo.permissions.find((permission: any) =>
    algorandMultisig.addrs?.includes(permission?.chainAccount)
  );
  requiredAccountsForMultiSigTransaction.push(keyAccount?.chainAccount);
  return requiredAccountsForMultiSigTransaction.join(",");
};
