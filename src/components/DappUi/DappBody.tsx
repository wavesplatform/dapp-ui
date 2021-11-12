import React from "react";
import { ICallableFuncTypesArray } from "@src/interface";
import { Card } from "@components/DappUi/Card";

interface IProps {
    callableFuncTypes?: ICallableFuncTypesArray
    address: string
}

export default class DappBody extends React.Component<IProps> {
    render() {
        const {callableFuncTypes, address} = this.props;

        return callableFuncTypes
            ? <div>
                {Object.entries(callableFuncTypes).map(([funcName, args]) =>
                    <Card address={address} funcName={funcName} funcArgs={args} key={funcName}/>)}
            </div>
            : null
    }
}

