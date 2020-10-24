import { IModalModel } from "../model/hooks.model";

export default class Actions {
  static TOGGLE_MODAL = "[Actions] TOGGLE_MODAL";
  static SET_MAP_LOCATION = "[Actions] SET_MAP_LOCATION";
  static SET_WALLET_STEP = "[Actions] SET_WALLET_STEP";
  static SET_WALLET_INFO = "[Actions] SET_WALLET_INFO";
}
export const actionInitialValue = {
  toggleModal: (modal: IModalModel) => {},
  setMapLocation: (lat: number, lng: number, zoom: number) => {},
  setWalletStep: (walletStep: number) => {},
  setWalletInfo: (walletPrivateKey: string) => {},
};
