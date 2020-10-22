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
}

export interface IActionModel {
  toggleModal: (modal: IModalModel) => void;
  setMapLocation: (lat: number, lng: number, zoom: number) => void;
}
