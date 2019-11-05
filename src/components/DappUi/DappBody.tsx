import React from "react";
import { ICallableFuncArgument, ICallableFuncTypes } from "@stores/DappStore";
import Card from "@components/DappUi/Card";

interface IProps {
    callableFuncTypes?: ICallableFuncTypes
    address: string
}

export default class DappBody extends React.Component<IProps> {
    render() {
        const {callableFuncTypes, address} = this.props;
        return callableFuncTypes
            ? <div>
                {Object.entries(callableFuncTypes).map(([funcName, args]: [string, ICallableFuncArgument]) =>
                    <Card address={address} funcName={funcName} funcArgs={args} key={funcName}/>
                )}
            </div>
            : null
    }
}

