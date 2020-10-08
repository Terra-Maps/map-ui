import Actions from "./Actions";
import { IModalModel } from "../model/hooks.model";

const Reducers = (dispatch: any) => ({
  toggleModal: (modal: IModalModel) => {
    dispatch({ type: Actions.TOGGLE_MODAL, modal });
  },
  setMapLocation: (lat: number, lng: number, zoom: number) => {
    console.log("Enter now", lat, lng, zoom);
    dispatch({ type: Actions.SET_MAP_LOCATION, lat, lng, zoom });
  },
});

export const stateInitialValue = {
  openModal: false,
  modalConfig: { type: "" },
  lat: 38,
  lng: -96,
  zoom: 4,
};

export default Reducers;
