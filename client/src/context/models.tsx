import React from 'react';
import {
  modelsReducer,
  initalState,
  ModelListAction,
  ModelListState,
} from '../reducers/modelList';

type ModelListContextProps = {
  state: ModelListState;
  dispatch: React.Dispatch<ModelListAction>;
};

const ModelsContext = React.createContext<ModelListContextProps>({
  state: initalState,
  dispatch: () => initalState,
});

export function ModelsProvider(props: React.PropsWithChildren<{}>) {
  const [state, dispatch] = React.useReducer(modelsReducer, initalState);
  return <ModelsContext.Provider value={{ state, dispatch }} {...props} />;
}

export default function useModels() {
  const context = React.useContext(ModelsContext);
  if (!context) {
    throw new Error(`useModels must be used within an ModelsProvider`);
  }
  return context;
}
