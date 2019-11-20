import { Action } from '@ngrx/store';
import { User } from '../../models/user';

export const LOGIN_USER = '[LOGIN] Login user';
export const LOGIN_USER_SUCCESS = '[LOGIN] Login User Success';
export const LOGIN_USER_FAILURE = '[LOGIN] Login User Failure';
export const LOGIN_UPDATE_USER = '[LOGIN] Login Update user';
export const LOGIN_UPDATE_USER_SUCCESS = '[LOGIN] Login Update User Success';
export const LOGIN_UPDATE_USER_FAILURE = '[LOGIN] Login Update User Failure';

export class LoginUserAction implements Action {
    public readonly type = LOGIN_USER;
}

export class LoginUserSuccessAction implements Action {
    public readonly type = LOGIN_USER_SUCCESS;

    constructor(public payload: User[]) {

    }
}

export class LoginUserFailureAction implements Action {
    public readonly type = LOGIN_USER_FAILURE;

    constructor(public payload: Error) {

    }
}

export class LoginUpdateUserAction implements Action {
    public readonly type = LOGIN_UPDATE_USER;

    constructor(public payload: any) {

    }
}

export class LoginUpdateUserSuccessAction implements Action {
    public readonly type = LOGIN_UPDATE_USER_SUCCESS;

    constructor(public payload: any) {

    }
}

export class LoginUpdateUserFailureAction implements Action {
    public readonly type = LOGIN_UPDATE_USER_FAILURE;

    constructor(public payload: Error) {

    }
}


export type Actions = LoginUserAction | LoginUserSuccessAction | LoginUserFailureAction | LoginUpdateUserAction | LoginUpdateUserSuccessAction | LoginUpdateUserFailureAction;
