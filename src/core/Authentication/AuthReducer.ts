
import { UserEntity } from "core/Models/UserEntity";
import { Reducer } from 'redux';
import { StatesAction } from "core/Actions/StatesAction";
import { AuthActionType } from "./AuthActionType";
import { AuthStates } from "./AuthStates";

export const AuthReducer: Reducer<AuthStates, StatesAction<AuthActionType>> = (state = new AuthStates(), action) => {
    switch (action.type) {
        case AuthActionType.SaveUserSuccess:
            return { ...state, currentUser: action.payload as UserEntity }
        case AuthActionType.RemoveCurrentUserSuccess:
            return { ...state, currentUser: null }
    }
    return state;
};
