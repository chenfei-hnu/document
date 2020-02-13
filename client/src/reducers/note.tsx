import { IErrors } from '../types';
import { INote, IModel } from '../types';

type NoteAction =
  | { type: 'FETCH_NOTE_BEGIN' }
  | {
    type: 'FETCH_NOTE_SUCCESS';
    payload: { note: INote };
  }
  | { type: 'FETCH_NOTE_ERROR'; noteErrors: IErrors }
  | {
    type: 'ADD_NOTE';
    note: IForm;
  }
  | {
    type: 'UPDATE_NOTE';
    note: IForm;
  }
  | { type: 'SET_ERRORS'; noteErrors: IErrors };

interface IForm {
  slug: string;
  name: string;
  content: string;
}

interface NoteState {
  note: IForm;
  noteErrors: IErrors;
  noteLoading: boolean;
}

export const initalState: NoteState = {
  note: {
    slug: '',
    name: '',
    content: '',
  },
  noteErrors: {},
  noteLoading: false,
};

export function noteReducer(
  state: NoteState,
  action: NoteAction,
): NoteState {
  switch (action.type) {
    case 'FETCH_NOTE_BEGIN':
      return {
        ...state,
        noteLoading: true,
        noteErrors: {},
      };
    case 'FETCH_NOTE_SUCCESS':
      return {
        ...state,
        noteLoading: false,
        note: action.payload.note,
      };
    case 'FETCH_NOTE_ERROR':
      return {
        ...state,
        noteLoading: false,
        noteErrors: action.noteErrors,
        note: {
          slug: '',
          name: '',
          content: '',
        },
      };
    case 'ADD_NOTE':
      return {
        ...state,
        note: action.note,
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        note: action.note,
      };
    case 'SET_ERRORS':
      return {
        ...state,
        noteErrors: action.noteErrors,
      };
    default:
      return state;
  }
}
