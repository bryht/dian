import Log from "core/Utils/Log";
import { IHttpRequest } from "./IHttpRequest";
import Env from "core/Env";

export default class HttpRequestHelper {

    public static CrateRequest(url: string, body: any | null = null, method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET'): IHttpRequest {
        return {
            url: url ?? '',
            body,
            method
        }
    }

    public static RequestAsync<T>(requestObj: IHttpRequest, accessToken: string | null = null): Promise<T> {
        return new Promise(resolve => {
            var request = new XMLHttpRequest();
            request.onreadystatechange = (e) => {

                if (request.readyState === 4 && request.status === 200) {
                    return resolve(JSON.parse(request.response) as T);
                } else {
                    Log.Info(request.status + request.responseText);
                }
            };
            request.open(requestObj.method, Env.baseUrl + requestObj.url);
            request.setRequestHeader('Accept', 'application/json');
            request.setRequestHeader('Content-Type', 'application/json');
            if (accessToken) {
                request.setRequestHeader('Authorization', `Bearer ${accessToken}`);
            }
            request.send(JSON.stringify(requestObj.body));
            console.log(request);
        })
    }

 
}