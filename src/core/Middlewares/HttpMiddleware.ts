import { Middleware } from "redux";
import { RootState } from "../Store";
import Consts from "core/Consts";
import Authentication from "core/Authentication/Auth";
import HttpRequestHelper from "core/Utils/HttpRequest/HttpRequestHelper";
import { UserEntity } from "core/Models/UserEntity";

export const HttpMiddleware: Middleware = api => next => async action => {
  if (action.type === Consts.api) {
    const { system } = api.getState() as RootState;

    api.dispatch(action.onStart);

    await Authentication.checkAuthenticationAsync(api.dispatch, system.currentUser as UserEntity);

    action.value = await HttpRequestHelper.RequestAsync({ url: action.url, method: action.method, body: action.body }, system.currentUser?.accessToken);

    api.dispatch(action.onSuccess);

  } else {

    return next(action);
  }

}