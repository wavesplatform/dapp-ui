import React from "react";
import styled from "@emotion/styled";
import { fonts } from "@src/styles";
import Button from "@components/DappUi/Button";
import Attach from "@src/assets/icons/Attach";
import { css } from "@emotion/core";
import DappStore, { ICallableArgumentType, ICallableFuncArgument } from "@stores/DappStore";
import ArgumentInput from "@components/DappUi/ArgumentInput";
import Close from "@src/assets/icons/Close";
import Input from "@components/Input";
import { inject, observer } from "mobx-react";
import AccountStore from "@stores/AccountStore";
import Select from "@components/DappUi/Select";

const flexStyle = css`display: flex;width: 100%;`;

const Root = styled.div`
${flexStyle};
background: white;
box-shadow: 0 5px 16px rgba(134, 142, 164, 0.05);
border-radius: 4px;
margin-bottom: 10px;
padding: 30px 40px;
flex-direction: column;
justify-content: flex-end;
`;

const FlexBlock = styled.div`${flexStyle}`;

const Header = styled.div`
${flexStyle};
border-bottom: 1px solid #EBEDF2;
padding-bottom: 20px;
justify-content: space-between;
margin: 0 0 20px 0;
`;

const ArgumentsLayout = styled.div`
${flexStyle};
//margin: 0 0 20px 0;
flex-direction: column;

`;

const ArgumentItem = styled.div`
${flexStyle};
margin-bottom: 14px;
`;

const ArgumentTitle = styled.div`
flex: 1;
display: flex;
margin-right: 20px;
align-items: center;
justify-content: flex-end;
`;

const ArgumentTitleVarName = styled.div`
${fonts.callableFuncArgFont};
 font-weight: bold;
`;

const ArgumentTitleVarType = styled.div`${fonts.callableFuncArgFont}`;

const AttachPaymentBtn = styled.div`
${flexStyle};
align-items: flex-end;
justify-content: flex-end;
`;

const AttachPaymentItems = styled.div`
${flexStyle};
flex-direction: column;
`

const AttachPaymentItem = styled.div`
${flexStyle};
align-items: center;

 & > :first-of-type{
  margin-right: 20px;
}
 > * {
  margin-bottom: 14px;
 }
`;

const Title = styled.div`${fonts.cardTitleFont}`;

export interface IArgumentInput {
    type: ICallableArgumentType,
    value: string | undefined
}


interface IInjectedProps {
    dappStore?: DappStore
    accountStore?: AccountStore
}

interface IProps extends IInjectedProps {
    funcName: string
    funcArgs: ICallableFuncArgument
    address: string
    key?: string
}

interface IState {
    args: { [name: string]: IArgumentInput }
    payments: { asset: string, count: number }[]
}

@inject('dappStore', 'accountStore')
@observer
export default class Card extends React.Component<IProps, IState> {

    get isInvalid() {
        const {args, payments} = this.state;
        const {funcArgs} = this.props;
        const invalidPayment = payments.some(({asset, count}) => !asset || !count);
        const invalidArgs = Object.keys(funcArgs).length !== Object.keys(args).length || Object.values(args)
            .some(({value}) => value === undefined || value === '');
        console.log('invalidPayment', invalidPayment, 'invalidArgs', invalidArgs)
        return invalidPayment || invalidArgs
    }

    handleAddAttach = () => this.setState({payments: [...this.state.payments, {asset: 'WAVES', count: 0}]});

    handleRemoveAttach = (i: number) => () => {
        const payments = this.state.payments;
        payments.splice(i, 1);
        this.setState({payments});
    };


    handleChangeValue = (name: string, type: ICallableArgumentType, value?: string) =>
        this.setState({args: {...this.state.args, [name]: {type, value}}});


    handleChangePaymentCount = (i: number) => ({target: {value: v}}: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(+v)) return;
        const payments = this.state.payments;
        payments[i].count = +v;
        this.setState({payments})
    };

    handleChangePaymentAsset = (i: number) => ({target: {value: v}}: React.ChangeEvent<HTMLSelectElement>) => {
        const payments = this.state.payments;
        payments[i].asset = v;
        this.setState({payments})
    };

    state: IState = {
        args: {},
        payments: []
    };

    handleCall = () => {

        const {dappStore, address, funcName: func} = this.props;
        const args = Object.values(this.state.args);
        const payment = undefined;
        // isSwitchedAttachPayment && payCount
        //     ? {assetId: blockchain, tokens: payCount}
        //     : undefined;
        dappStore!.callCallableFunction(address, func, args, payment);
    };


    render() {
        const {funcName: title, funcArgs, accountStore} = this.props;
        const {args} = this.state;
        return <Root id={title}>
            <Header>
                <Title>{title}</Title>
                <Button onClick={this.handleCall} disabled={this.isInvalid}>{title}</Button>
            </Header>
            <ArgumentsLayout>
                {Object.keys(funcArgs).length > 0 &&
                Object.entries(funcArgs).map(([argName, type]: [string, ICallableArgumentType], i: number) =>
                    <ArgumentItem key={i}>
                        <ArgumentTitle>
                            <ArgumentTitleVarName>{argName}:</ArgumentTitleVarName>
                            &nbsp;
                            <ArgumentTitleVarType>{type}</ArgumentTitleVarType>
                        </ArgumentTitle>
                        <ArgumentInput
                            css={css`flex:5`}
                            value={args[argName] ? args[argName].value : undefined}
                            name={argName}
                            type={type}
                            onChange={this.handleChangeValue}
                        />
                    </ArgumentItem>
                )}
            </ArgumentsLayout>
            <FlexBlock>
                <AttachPaymentItems>
                    {this.state.payments.map(({asset, count}, i) =>
                        <AttachPaymentItem key={i}>
                            <Select onChange={this.handleChangePaymentAsset(i)} value={asset}>
                                {accountStore!.assets.map(({assetId, name}) =>
                                    <option key={assetId} value={assetId}>{name}</option>)}
                            </Select>
                            <Input type="number" onChange={this.handleChangePaymentCount(i)} value={String(count)}/>
                            <Close onClick={this.handleRemoveAttach(i)}/>
                        </AttachPaymentItem>)}
                </AttachPaymentItems>
                <AttachPaymentBtn><Attach onClick={this.handleAddAttach}/></AttachPaymentBtn>
            </FlexBlock>
        </Root>
    }
}
