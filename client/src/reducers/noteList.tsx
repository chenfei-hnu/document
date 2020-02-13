import { IErrors } from '../types';
import { INote, IModel } from '../types';

type NoteListAction =
  | { type: 'UPDATE_REFRESH'; needRefreshCount: number }
  | { type: 'FETCH_NOTELIST_BEGIN' }
  | {
    type: 'FETCH_NOTELIST_SUCCESS';
    payload: { notes: Array<INote> };
  }
  | { type: 'FETCH_NOTELIST_ERROR'; notesErrors: IErrors }
  | { type: 'SET_ERRORS'; notesErrors: IErrors };


interface NoteListState {
  notes: Array<INote>;
  needRefreshCount: number;
  notesErrors: IErrors;
  notesLoading: boolean;
}

export const initalState: NoteListState = {
  notes: [],
  needRefreshCount: 0,
  notesErrors: {},
  notesLoading: false,
};

export function noteListReducer(
  state: NoteListState,
  action: NoteListAction,
): NoteListState {
  switch (action.type) {
    case 'FETCH_NOTELIST_BEGIN':
      return {
        ...state,
        notesLoading: true,
        notesErrors: {},
      };
    case 'FETCH_NOTELIST_SUCCESS':
      return {
        ...state,
        notesLoading: false,
        notes: action.payload.notes,
      };
    case 'FETCH_NOTELIST_ERROR':
      return {
        ...state,
        notesLoading: false,
        notesErrors: action.notesErrors,
        notes: []
      };
    case 'SET_ERRORS':
      return {
        ...state,
        notesErrors: action.notesErrors,
      };
    case 'UPDATE_REFRESH':
      return {
        ...state,
        needRefreshCount: action.needRefreshCount,
      };
    default:
      return state;
  }
}
