import { UnknownAction } from "redux";
import React from "react";
import { BasicState } from "./BasicState";
import { BasicProps } from "./BasicProps";
import { RootState } from "core/Store";


export class RootComponent<Props extends BasicProps, States extends BasicState | unknown> extends React.Component<Props, States>{
    
    async invokeDispatchAsync(action: unknown) {
        const { dispatch } = this.props;
        return await dispatch(action as UnknownAction);
    }

}


export function mapRootStateToProps(state: RootState) {
    return { currentUser: state.system.currentUser }
}
