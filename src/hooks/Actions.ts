import { IActionModel, IModalModel } from "../model/hooks.model";

export default class Actions {
  static TOGGLE_MODAL = "[Actions] TOGGLE_MODAL";
  static SET_MAP_LOCATION = "[Actions] SET_MAP_LOCATION";
  static SET_WALLET_STEP = "[Actions] SET_WALLET_STEP";
  static SET_DECRYPTED_WALLET_INFO = "[Actions] SET_DECRYPTED_WALLET_INFO";
  static SET_USER = "[Actions] SET_USER";
  static SET_DECRYPTION_DONE = "[Actions] SET_DECRYPTION_DONE";
  static SET_DECRYPTION_FOR = "[Actions] SET_DECRYPTION_FOR";
}
export const actionInitialValue: IActionModel = {
  toggleModal: (modal: IModalModel) => {},
  setMapLocation: (lat: number, lng: number, zoom: number) => {},
  setWalletStep: (walletStep: number) => {},
  setWalletInfo: (walletPrivateKey: string | null) => {},
  fetchUser: async () => {},
  resetUser: async () => {},
  setDecryptionDone: (done: boolean) => {},
  setDecryptionFor: (decryptionFor: string | null) => {},
};
