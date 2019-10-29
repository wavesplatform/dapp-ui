import React from "react";
import FuncField from "@components/DappUi/FuncField";
import { ICallableFuncArgument, ICallableFuncTypes } from "@stores/DappStore";

interface IProps {
    callableFuncTypes?: ICallableFuncTypes
    address: string
}

export default class DappBody extends React.Component<IProps> {
    render() {
        const {callableFuncTypes, address} = this.props;
        return callableFuncTypes
            ? <div >
                {Object.entries(callableFuncTypes).map(([funcName, args]: [string, ICallableFuncArgument]) =>
                    <FuncField address={address} funcName={funcName} funcArgs={args} key={funcName}/>)}
            </div>
            : null
    }
}

