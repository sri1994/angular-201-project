import { User } from '../../models/user';
import * as AuthActions from '../actions/auth.actions';

export interface State {
  list: [];
  loading: false;
  error: Error;
}

export const initialState: State = {
  list: [],
  loading: false,
  error: undefined
};

export function authReducer(state: State = initialState, action: AuthActions.Actions) {
  switch (action.type) {
    case AuthActions.LOGIN_USER: {
      return { ...state, loading: true};
    }
    case AuthActions.LOGIN_USER_SUCCESS: {
      return {...state, list: action.payload, loading: false};
    }
    case AuthActions.LOGIN_USER_FAILURE: {
      return {...state, error: action.payload, loading: false};
    }
    case AuthActions.LOGIN_UPDATE_USER: {
      return { ...state, loading: true};
    }
    case AuthActions.LOGIN_UPDATE_USER_SUCCESS: {
      return {...state, list: modifyList(state.list, action.payload), loading: false};
    }
    case AuthActions.LOGIN_UPDATE_USER_FAILURE: {
      return {...state, error: action.payload, loading: false};
    }
    default:
      return state;
  }
}

function modifyList(list: any[], payload: any): any {
  const listMap = list.map(item => {
    if (item.id === payload.id) {
      return payload;
    } else {
      return item;
    }
  });
  return listMap;
}
