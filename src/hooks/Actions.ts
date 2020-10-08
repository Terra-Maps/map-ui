import { IModalModel } from "../model/hooks.model";

export default class Actions {
  static TOGGLE_MODAL = "[Actions] TOGGLE_MODAL";
  static SET_MAP_LOCATION = "[Actions] SET_MAP_LOCATION";
}
export const actionInitialValue = {
  toggleModal: (modal: IModalModel) => {},
  setMapLocation: (lat: number, lng: number, zoom: number) => {},
};
