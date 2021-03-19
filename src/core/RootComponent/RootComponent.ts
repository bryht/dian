import { Action } from "redux";
import { UserEntity } from "core/Models/UserEntity";
import Authentication from "core/Authentication/Auth";
import React from "react";
import { BasicState } from "./BasicState";
import { BasicProps } from "./BasicProps";
import { RootState } from "core/Store";
import HttpRequestHelper from "core/Utils/HttpRequest/HttpRequestHelper";
import { IHttpRequest } from "core/Utils/HttpRequest/IHttpRequest";


export class RootComponent<Props extends BasicProps, States extends BasicState | any> extends React.Component<Props, States>{
    
    async invokeAsync<T>(request: IHttpRequest): Promise<T> {

        return HttpRequestHelper.RequestAsync<T>(request);
    }

    async invokeAsyncWithAuth(request: IHttpRequest): Promise<any> {

        const { dispatch, currentUser } = this.props;

        await Authentication.checkAuthenticationAsync(dispatch, currentUser as UserEntity);

        return HttpRequestHelper.RequestAsync(request,currentUser?.accessToken);
    }

    async invokeDispatchAsync(action: Action) {
        const { dispatch } = this.props;
        return await dispatch(action);
    }


}


export function mapRootStateToProps(state: RootState) {
    return { currentUser: state.system.currentUser }
}
