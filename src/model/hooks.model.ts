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
  walletPrivateKey: string;
  walletAccount: any;
  walletInfo: any;
}

export interface IActionModel {
  toggleModal: (modal: IModalModel) => void;
  setMapLocation: (lat: number, lng: number, zoom: number) => void;
  setWalletStep: (walletStep: number) => void;
  setWalletInfo: (walletPrivateKey: string) => Promise<void>;
}
