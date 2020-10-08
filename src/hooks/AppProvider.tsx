import React, { createContext, useMemo } from "react";
import Actions, { actionInitialValue } from "./Actions";
import { IActionModel, IStateModel } from "../model/hooks.model";
import Reducers, { stateInitialValue } from "./Reducers";

export const ActionContext = createContext<IActionModel>(actionInitialValue);
export const StateContext = createContext<IStateModel>(stateInitialValue);

export const AppProvider = (props: any) => {
  const [state, dispatch] = React.useReducer((prevState: any, action: any) => {
    switch (action.type) {
      case Actions.TOGGLE_MODAL:
        return {
          ...prevState,
          openModal: action.modal.openModal,
          modalConfig: action.modal.modalConfig,
        };
      case Actions.SET_MAP_LOCATION:
        return {
          ...prevState,
          lat: action.lat,
          lng: action.lng,
          zoom: action.zoom,
        };

      default:
    }
  }, stateInitialValue);

  const actionContext = useMemo(
    () => Reducers(dispatch),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
  return (
    <ActionContext.Provider value={actionContext}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </ActionContext.Provider>
  );
};
