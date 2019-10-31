import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import * as AuthActions from './../actions/auth.actions';
import { AuthService } from './../../auth.service';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class AuthEffects {
    @Effect() loginUser$ = this.actions$.pipe(ofType<AuthActions.LoginUserAction>(AuthActions.LOGIN_USER),
        mergeMap(
            () => this.authService.getCredentialList()
                .pipe(
                    map(data => new AuthActions.LoginUserSuccessAction(data)),
                    catchError(error => of(new AuthActions.LoginUserFailureAction(error)))
                )
        )
    );

    @Effect() updateUser$ = this.actions$.pipe(ofType<AuthActions.LoginUpdateUserAction>(AuthActions.LOGIN_UPDATE_USER),
        mergeMap(
            (data) => this.authService.updateWhetherAuthenticated(data.payload)
                .pipe(
                    map(data => new AuthActions.LoginUpdateUserSuccessAction(data)),
                    catchError(error => of(new AuthActions.LoginUpdateUserFailureAction(error)))
                )
        )
    );

    constructor(private actions$: Actions, private authService: AuthService) {

    }
}