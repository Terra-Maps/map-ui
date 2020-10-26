import Actions from "./Actions";
import { IModalModel } from "../model/hooks.model";
import config from "../config";
import algosdk from "algosdk";

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
    const algodclient = new algosdk.Algodv2(config.algorand.token, config.algorand.baseServer, config.algorand.port);
    let myAccount = algosdk.mnemonicToSecretKey(walletPrivateKey);
    let walletInfo = await algodclient.accountInformation(myAccount.addr).do();
    console.log(walletInfo)
    dispatch({ type: Actions.SET_WALLET_INFO, walletPrivateKey, walletAccount: myAccount, walletInfo });
    const modal = {
      openModal: false,
      modalConfig: { type: "" },
    }
    dispatch({ type: Actions.TOGGLE_MODAL, modal });
  },
});

export const stateInitialValue = {
  openModal: false,
  modalConfig: { type: "" },
  lat: 26,
  lng: 75,
  zoom: 4,
  walletStep: 0,
  walletPrivateKey: "",
  walletAccount: null,
  walletInfo: null
};

export default Reducers;
