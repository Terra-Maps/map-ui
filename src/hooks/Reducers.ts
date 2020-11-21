import Actions from "./Actions";
import { IActionModel, IModalModel, IStateModel } from "../model/hooks.model";
import { ApiService } from "../service";

const Reducers = (dispatch: any): IActionModel => ({
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
    dispatch({
      type: Actions.SET_DECRYPTED_WALLET_INFO,
      walletPrivateKey
    });
  },
  fetchUser: async () => {
    dispatch({ type: Actions.SET_USER_LOADING, userLoading: true });
    const response = await ApiService.fetchUser("1234");
    console.log(response);
    if (response.user) {
      dispatch({ type: Actions.SET_USER, user: response.user });
      dispatch({ type: Actions.SET_USER_LOADING, userLoading: false });
      if (response.user?.wallet?.address && response.user?.wallet?.passphrase) {
        const modal = {
          openModal: false,
          modalConfig: { type: "" },
        };
        dispatch({ type: Actions.TOGGLE_MODAL, modal });
      } else {
        const modal = {
          openModal: true,
          modalConfig: { type: "wallet" },
        };
        dispatch({ type: Actions.TOGGLE_MODAL, modal });
      }
    } else {
      localStorage.removeItem("jwt-token");
      dispatch({ type: Actions.SET_USER, user: null });
      dispatch({ type: Actions.SET_USER_LOADING, userLoading: false });
    }
  },
  resetUser: async () => {
    dispatch({ type: Actions.SET_USER, user: null });
  },
  setDecryptionDone: (done: boolean) => {
    dispatch({ type: Actions.SET_DECRYPTION_DONE, decryptionDone: done });
  },
  setDecryptionFor: (decryptionFor: string | null) => {
    dispatch({ type: Actions.SET_DECRYPTION_FOR, decryptionFor });

  }
});

export const stateInitialValue: IStateModel = {
  openModal: false,
  modalConfig: { type: "" },
  lat: 26.29,
  lng: 78.12,
  zoom: 4,
  walletStep: 0,
  encryptedWalletPrivateKey: "",
  decryptedWalletPrivateKey: "",
  user: null,
  userLoading: true,
  decryptionDone: false,
  decryptionFor: null
};

export default Reducers;
