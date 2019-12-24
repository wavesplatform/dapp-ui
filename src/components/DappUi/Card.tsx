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
import Select from "@components/Select";

const flexStyle = css`display: flex;width: 100%;`;

const Root = styled.div`
position: relative;
display: flex;
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
    byteVectorType?: 'base58' | 'base64'
}


const Anchor = styled.div`
position:absolute;
top:-100px;
`;

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
    payments: { assetId: string, tokens: string }[]
}

@inject('dappStore', 'accountStore')
@observer
export default class Card extends React.Component<IProps, IState> {

    constructor(props: IProps) {
        super(props);
        this.state = {
            args: Object.entries(this.props.funcArgs).reduce((acc, [k, v]) =>
                ({...acc, [k]: {type: v, byteVectorType: v === 'ByteVector' ? 'base58' : undefined}}), {}),
            payments: []
        };
    }


    get isInvalid() {
        const {args, payments} = this.state;
        const {funcArgs} = this.props;
        const invalidPayment = payments.some(({assetId, tokens}) => !assetId || !tokens);
        const invalidArgs = Object.keys(funcArgs).length !== Object.keys(args).length || Object.values(args)
            .some(({value}) => value === undefined || value === '');
        return invalidPayment || invalidArgs
    }

    handleAddAttach = () => this.setState({
        payments: [...this.state.payments, {
            assetId: 'WAVES',
            tokens: (0).toFixed(8)
        }]
    });

    handleRemoveAttach = (i: number) => () => {
        const payments = this.state.payments;
        payments.splice(i, 1);
        this.setState({payments});
    };

    handleChangeValue = (name: string, type: ICallableArgumentType, value?: string) =>
        this.setState({args: {...this.state.args, [name]: {...this.state.args[name], type, value}}});

    handleChangeByteVectorType = (name: string, byteVectorType: 'base58' | 'base64') =>
        this.setState({args: {...this.state.args, [name]: {...this.state.args[name], byteVectorType}}});

    handleChangePaymentCount = (i: number) => ({target: {value: v}}: React.ChangeEvent<HTMLInputElement>) => {
        if (isNaN(+v) || +v < 0) return;
        const payments = this.state.payments;
        payments[i].tokens = v;
        this.setState({payments})
    };

    handleBlurPaymentCount = (i: number) => ({target: {value: v}}: React.ChangeEvent<HTMLInputElement>) => {
        const payments = this.state.payments;
        payments[i].tokens = (+v).toFixed(this.props.accountStore!.assets[payments[i].assetId].decimals || 1e-8);
        this.setState({payments})
    };

    handleChangePaymentAsset = (i: number) => ({target: {value: v}}: React.ChangeEvent<HTMLSelectElement>) => {
        const payments = this.state.payments;
        payments[i].assetId = v;
        this.setState({payments})
    };


    handleCall = () => {
        const {dappStore, address, funcName: func} = this.props;
        const args = Object.values(this.state.args);
        dappStore!.callCallableFunction(address, func, args, this.state.payments.map(p => ({...p, tokens: +p.tokens})));
    };


    render() {
        const {funcName: title, accountStore} = this.props;
        const {args} = this.state;
        return <Root >
            <Anchor id={title}/>
            <Header>
                <Title>{title}</Title>
                <Button onClick={this.handleCall} disabled={this.isInvalid}>{title}</Button>
            </Header>
            <ArgumentsLayout>
                {Object.keys(args).length > 0 &&
                Object.entries(args).map(([argName, {type}], i: number) =>
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
                            onChangeByteVectorType={this.handleChangeByteVectorType}
                        />
                    </ArgumentItem>
                )}
            </ArgumentsLayout>
            <FlexBlock>
                <AttachPaymentItems>
                    {this.state.payments.map(({assetId, tokens}, i) => {
                        const decimals = accountStore!.assets[assetId].decimals || 8;
                        return <AttachPaymentItem key={i}>
                            <Select onChange={this.handleChangePaymentAsset(i)} value={assetId}>
                                {Object.values(accountStore!.assets).map(({assetId, name}) =>
                                    <option key={assetId} value={assetId}>{name}({assetId})</option>)}
                            </Select>
                            <Input
                                type="number"
                                min={0}
                                step={10 ** -decimals}
                                onChange={this.handleChangePaymentCount(i)}
                                value={String(tokens)}
                                onBlur={this.handleBlurPaymentCount(i)}
                            />
                            <Close onClick={this.handleRemoveAttach(i)}/>
                        </AttachPaymentItem>
                    })}
                </AttachPaymentItems>
                <AttachPaymentBtn><Attach onClick={this.handleAddAttach}/></AttachPaymentBtn>
            </FlexBlock>
        </Root>
    }
}

