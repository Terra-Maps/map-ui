export interface IModalConfig {
  type?: string;
}

export interface IModalModel {
  openModal: boolean;
  modalConfig: IModalConfig;
}

export interface IStateModel {
  openModal: boolean;
  modalConfig: IModalConfig;
  lat: number;
  lng: number;
  zoom: number;
  walletStep: number;
  encryptedWalletPrivateKey: any;
  decryptedWalletPrivateKey: any;
  user: any;
  decryptionDone: boolean;
  decryptionFor: string | null;
}

export interface IActionModel {
  toggleModal: (modal: IModalModel) => void;
  setMapLocation: (lat: number, lng: number, zoom: number) => void;
  setWalletStep: (walletStep: number) => void;
  setWalletInfo: (walletPrivateKey: string) => void;
  fetchUser: () => void
  resetUser: () => void
  setDecryptionDone: (done: boolean) => void;
  setDecryptionFor: (decryptionFor: string | null) => void;
}
