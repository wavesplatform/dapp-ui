import React from "react";
import ArgumentInput from "@components/DappUi/ArgumentInput";
import { inject, observer } from "mobx-react";
import DappStore, { ICallableArgumentType, ICallableFuncArgument } from "@stores/DappStore";
import AccountStore from "@stores/AccountStore";
import Card from "@components/DappUi/Card";

export interface IArgumentInput {
    type: ICallableArgumentType,
    value: string | undefined
}

interface IInjectedProps {
    dappStore?: DappStore
    accountStore?: AccountStore
}

interface IFuncFieldProps extends IInjectedProps {
    funcName: string
    funcArgs: ICallableFuncArgument
    address: string
}

interface IFuncFieldState {
    isSwitchedAttachPayment: boolean
    args: { [name: string]: IArgumentInput }
    blockchain: string
    payment?: number
}


@inject('dappStore', 'accountStore')
@observer
class FuncField extends React.Component<IFuncFieldProps, IFuncFieldState> {

    state: IFuncFieldState = {
        isSwitchedAttachPayment: false,
        args: {},
        blockchain: 'WAVES'
    };

    toggleAttachPayment = (isSwitchedAttachPayment: boolean) => this.setState({isSwitchedAttachPayment});

    changeBlockchain = (blockchain: string) => this.setState({blockchain})

    handleChangePayment = (payment?: number) => this.setState({payment});

    handleChangeValue = (name: string, type: ICallableArgumentType, value?: string) =>
        this.setState({args: {...this.state.args, [name]: {type, value}}});

    handleCall = () => {
        const {dappStore, address, funcName} = this.props;
        const {isSwitchedAttachPayment, blockchain, payment: payCount} = this.state;
        const args = Object.values(this.state.args);
        const payment = isSwitchedAttachPayment && payCount
            ? {assetId: blockchain, tokens: payCount}
            : undefined;
        dappStore!.callCallableFunction(address, funcName, args, payment)
    };

    get isInvalid() {
        const {isSwitchedAttachPayment, args, payment} = this.state;
        const {funcArgs} = this.props;
        const invalidPayment = isSwitchedAttachPayment && !payment;
        const invalidArgs = Object.keys(funcArgs).length !== Object.keys(args).length || Object.values(args).some(({value}) => {
            console.log(value)
            return value === undefined || value === ''
        });
        console.log('invalidPayment', invalidPayment, 'invalidArgs', invalidArgs)
        return invalidPayment || invalidArgs
    }

    render() {
        const {funcName, funcArgs, accountStore} = this.props;
        const {isSwitchedAttachPayment, args, blockchain, payment} = this.state;
        return <Card title={funcName} onCall={this.handleCall}/>
        {/*<Card*/}
            {/*<Divider orientation="left">*/}
                // Attach payment <Switch checked={isSwitchedAttachPayment} onClick={this.toggleAttachPayment}/>
            // </Divider>
            // {isSwitchedAttachPayment && <div className={styles.paymentField}>
                {/*<Select className={styles.paymentInput} value={blockchain} onChange={this.changeBlockchain}>*/}
                    // {accountStore!.assets.map(({assetId, name}) =>
                        {/*<Select.Option key={assetId} value={assetId}>{name}</Select.Option>)*/}
                    // }
                // </Select>
                {/*<InputNumber className={styles.paymentInput} value={payment} onChange={this.handleChangePayment}/>*/}
            // </div>}
            // {Object.keys(funcArgs).length > 0 &&
            // Object.entries(funcArgs).map(([argName, type]: [string, ICallableArgumentType], i: number) =>
                {/*<div key={i} className={styles.argumentField}>*/}
                {/*    <div className={styles.argumentFieldTitle}><h3>{argName}:</h3>&nbsp;<p>{type}</p></div>*/}
                {/*    <ArgumentInput*/}
                        // value={args[argName] ? args[argName].value : undefined}
                        // name={argName}
                        // type={type}
                        // onChange={this.handleChangeValue}
                    // />
                //
                // </div>
            // )}
        //
        // </Card>
    }
}

export default FuncField
