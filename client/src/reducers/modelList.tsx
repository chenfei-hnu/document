import { IModel } from '../types';

export type ModelListAction =
  | { type: 'FETCH_MODELS_BEGIN' }
  | { type: 'UPDATE_REFRESH'; needRefreshCount: number }
  | {
    type: 'FETCH_MODELS_SUCCESS';
    payload: { models: Array<IModel>; totalCount: number };
  }
  | { type: 'FETCH_MODELS_ERROR'; error: string }
  | { type: 'SET_PAGE'; page: number };


export interface ModelListState {
  models: Array<IModel>;
  loading: boolean;
  needRefreshCount: number;
  error: string | null;
  totalCount: number;
  page: number;
}

export const initalState: ModelListState = {
  models: [],
  needRefreshCount: 0,
  loading: false,
  error: null,
  totalCount: 0,
  page: 0,
};

export function modelsReducer(
  state: ModelListState,
  action: ModelListAction,
): ModelListState {
  switch (action.type) {
    case 'FETCH_MODELS_BEGIN':
      return {
        ...state,
        loading: true,
        error: null,
        totalCount: 0
      };
    case 'FETCH_MODELS_SUCCESS':
      return {
        ...state,
        loading: false,
        models: action.payload.models,
        totalCount: action.payload.totalCount,
      };
    case 'FETCH_MODELS_ERROR':
      return {
        ...state,
        loading: false,
        error: action.error,
        models: [],
      };
    case 'UPDATE_REFRESH':
      return {
        ...state,
        needRefreshCount: action.needRefreshCount,
      };
    case 'SET_PAGE':
      return {
        ...state,
        page: action.page,
      };
    default:
      return state;
  }
}
