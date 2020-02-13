import { IAdmin } from '../types';

export type AuthAction =
  | {
    type: 'LOGIN';
  }
  | {
    type: 'LOAD_USER';
    admin: IAdmin;
  }
  | { type: 'LOGOUT' };

export interface AuthState {
  isAuthenticated: boolean;
  admin: IAdmin | null;
}

export const initalState: AuthState = {
  isAuthenticated: false,
  admin: null,
};

export function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN': {
      return { ...state, isAuthenticated: true };
    }
    case 'LOAD_USER': {
      return { ...state, admin: action.admin };
    }
    case 'LOGOUT': {
      return { isAuthenticated: false, admin: null };
    }
    default:
      return state;
  }
}
