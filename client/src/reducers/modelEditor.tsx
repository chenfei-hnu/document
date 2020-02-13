import { IErrors } from '../types';
import { IModel, IProfile } from '../types';

type ModelEditorAction =
  | {
    type: 'SET_FORM';
    form: IForm;
  }
  | {
    type: 'UPDATE_FORM';
    field: { key: keyof IForm; value: IForm[keyof IForm] };
  }
  | { type: 'SET_ERRORS'; errors: IErrors };

interface IForm {
  name: string;
  desc: string;
}

interface ModelEditorState {
  form: IForm;
  errors: IErrors;
  loading: boolean;
}

export const initalState: ModelEditorState = {
  form: {
    name: '',
    desc: '',
  },
  errors: {},
  loading: false,
};

export function modelEditorReducer(
  state: ModelEditorState,
  action: ModelEditorAction,
): ModelEditorState {
  switch (action.type) {
    case 'SET_FORM':
      return {
        ...state,
        form: action.form,
      };
    case 'UPDATE_FORM':
      return {
        ...state,
        form: {
          ...state.form,
          [action.field.key]: action.field.value,
        },
      };
    case 'SET_ERRORS':
      return {
        ...state,
        errors: action.errors,
      };
    default:
      return state;
  }
}
