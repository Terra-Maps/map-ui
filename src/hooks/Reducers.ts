import Actions from "./Actions";
import { IModalModel } from "../model/hooks.model";
import config from "../config";
import algosdk from "algosdk";
import { OreService } from "../service";

const Reducers = (dispatch: any) => ({
  toggleModal: (modal: IModalModel) => {
    dispatch({ type: Actions.TOGGLE_MODAL, modal });
  },
  setMapLocation: (lat: number, lng: number, zoom: number) => {
    dispatch({ type: Actions.SET_MAP_LOCATION, lat, lng, zoom });
  },
  setWalletStep: (walletStep: number) => {
    dispatch({ type: Actions.SET_WALLET_STEP, walletStep });
  },
  setWalletInfo: async (walletPrivateKey: string) => {
    return new Promise<void>(async (resolve, reject) => {
      const algodclient = new algosdk.Algodv2(
        config.algorand.TOKEN,
        config.algorand.BASE_SERVER,
        config.algorand.PORT
      );
      let myAccount = algosdk.mnemonicToSecretKey(walletPrivateKey);
      let walletInfo = await algodclient
        .accountInformation(myAccount.addr)
        .do();
      console.log(walletInfo);
      dispatch({
        type: Actions.SET_WALLET_INFO,
        walletPrivateKey,
        walletAccount: myAccount,
        walletInfo,
      });
      const modal = {
        openModal: false,
        modalConfig: { type: "" },
      };
      dispatch({ type: Actions.TOGGLE_MODAL, modal });
      resolve();
    });
  },
  fetchUser: async (userInfo?: any) => {
    let userInfoNew: any = null;
    if(!userInfo) {
      userInfoNew = await OreService.loadUserAfterLogin();
    } else {
      userInfoNew = userInfo;
    }
    console.log(userInfoNew);
    if (userInfoNew.accountName) {
      dispatch({ type: Actions.SET_USER, user: userInfoNew });
      const modal = {
        openModal: false,
        modalConfig: { type: "" },
      };
      dispatch({ type: Actions.TOGGLE_MODAL, modal });
    } else {
      dispatch({ type: Actions.SET_USER, user: null });
    }
  },
  resetUser: async () => {
    dispatch({ type: Actions.SET_USER, user: null });
  }
});

export const stateInitialValue = {
  openModal: false,
  modalConfig: { type: "" },
  lat: 26.29,
  lng: 78.12,
  zoom: 4,
  walletStep: 0,
  walletPrivateKey: "",
  walletAccount: null,
  walletInfo: null,
  user: null,
};

export default Reducers;
