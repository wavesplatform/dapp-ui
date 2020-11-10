/** @jsx jsx **/
import React from 'react';
import styled from '@emotion/styled';
import {fonts} from '@src/styles';
import Button from '@components/DappUi/Button';
import Attach from '@src/assets/icons/Attach';
import {css, jsx} from '@emotion/core';
import DappStore, {b58strTob64Str} from "@stores/DappStore";
import {ICallableArgumentType, TCallableFuncArgumentsArray} from "@stores/MetaStore";
import ArgumentInput from '@components/DappUi/ArgumentInput';
import Close from '@src/assets/icons/Close';
import {inject, observer} from 'mobx-react';
import AccountStore from '@stores/AccountStore';
import Select from '@components/Select';
import {Option} from 'rc-select';
import {centerEllipsis} from '@components/Home/Account';
import {autorun} from 'mobx';
import InputNumber from '@components/Input/InputNumber';
import Tooltip from 'rc-tooltip';
import Decimal from "decimal.js";

const flexStyle = css`display: flex;width: 100%;`;

const Root = styled.div`
flex-shrink: 0;
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

const FlexBlock = styled.div`
${flexStyle};
@media(max-width: 1280px){
  flex-direction: column;
}
`;

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
border-bottom: 1px solid #EBEDF2;
margin-bottom: 16px;
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
min-width: 100px;
max-width: 150px;
`;

const ArgumentTitleVarName = styled.div`
${fonts.callableFuncArgFont};
 font-weight: bold;
`;

const ArgumentTitleVarType = styled.div`${fonts.callableFuncArgFont}`;

const AttachPaymentBtn = styled.div`
${flexStyle};
justify-content: flex-end;
flex: 1;
`;

const AttachPaymentItems = styled.div`
${flexStyle};
flex-direction: column;
flex: 3;
//@media(max-width: 1280px){
//  flex: 2;
//}
`;

const AttachPaymentItem = styled.div`
${flexStyle};
align-items: center;
  margin: 0 -10px;
 & > *{
  margin: 0 10px;
}
 & > * {
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
    funcArgs: TCallableFuncArgumentsArray
    address: string
    key?: string
}

interface IState {
    args: { [name: string]: IArgumentInput }
    payments: { assetId: string, tokens: string }[]
    address: string | null
}

@inject('dappStore', 'accountStore')
@observer
export default class Card extends React.Component<IProps, IState> {

    state: IState = {
        args: this.props.funcArgs.reduce((acc, arg) =>
            ({
                ...acc,
                [arg.name]: {
                    type: arg.type,
                    byteVectorType: arg.type === 'ByteVector' ? 'base58' : undefined,
                    value: defaultValue(arg.type)
                }
            }), {}),
        payments: [],
        address: this.props.accountStore!.address
    };

    componentDidMount() {
        autorun(() => {
            let {payments} = this.state;
            const address = this.props.accountStore!.address;
            if (this.state.address !== null && this.state.address !== address) {
                payments = [];
            }
            this.setState({payments, address});
        });
    }


    get isInvalid() {
        const {args, payments} = this.state;
        const {funcArgs} = this.props;
        const invalidPayment = payments.some(({assetId, tokens}) => !assetId || !tokens);
        const invalidArgs = funcArgs.length !== Object.keys(args).length || Object.values(args)
            .some(({value}) => value === undefined);
        const invalidB58 = Object.values(args).some(({value, byteVectorType}) => {
            let error = false;
            if (byteVectorType && byteVectorType === 'base58') {
                try {
                    b58strTob64Str(value);
                } catch (e) {
                    error = true;
                }
            }
            return error;
        });
        return invalidPayment || invalidArgs || invalidB58;
    }

    handleAddAttach = () => this.state.payments.length < 2 && this.setState({
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

    handleChangeValue = (name: string, type: ICallableArgumentType, value?: string) => {
        // if (type === 'Int' && value && (isNaN(+value) || value.includes('e'))) value = value.replace('e', '');
        this.setState({args: {...this.state.args, [name]: {...this.state.args[name], type, value}}});
    };
    handleChangeByteVectorType = (name: string, byteVectorType: 'base58' | 'base64') =>
        this.setState({args: {...this.state.args, [name]: {...this.state.args[name], byteVectorType}}});

    handleChangePaymentCount = (i: number) => (v: string | number) => {
        if (isNaN(+v) || +v < 0) return;
        const payments = this.state.payments;
        payments[i].tokens = String(v);
        this.setState({payments});
    };

    handleBlurPaymentCount = (i: number) => ({target: {value: v}}: React.ChangeEvent<HTMLInputElement>) => {
        const payments = this.state.payments;
        payments[i].tokens = (+v).toFixed(this.props.accountStore!.assets[payments[i].assetId].decimals || 1e-8);
        this.setState({payments});
    };

    handleChangePaymentAsset = (i: number) => (assetId: string) => {
        const payments = this.state.payments;
        payments[i] = {assetId, tokens: (0).toFixed(this.props.accountStore!.assets[assetId].decimals || 8)};
        this.setState({payments});
    };


    handleCall = () => {
        const {dappStore, address, funcName: func} = this.props;
        const args = Object.values(this.state.args);
        dappStore!.callCallableFunction(address, func, args, this.state.payments.map(p => ({...p, tokens: +p.tokens})));
    };


    render() {
        const {funcName: title, accountStore} = this.props;
        const {args, payments} = this.state;
        return <Root>
            <Anchor id={title}/>
            <Header>
                <Title>{centerEllipsis(title)}</Title>
                <Button onClick={this.handleCall} disabled={this.isInvalid}>Invoke</Button>
            </Header>
            {Object.keys(args).length > 0 &&
            <ArgumentsLayout>
                {Object.entries(args).map(([argName, {type}], i: number) =>
                    <ArgumentItem key={i}>
                        <ArgumentTitle>
                            <ArgumentTitleVarName>{centerEllipsis(argName, 7)}:</ArgumentTitleVarName>
                            &nbsp;
                            <ArgumentTitleVarType>{type}</ArgumentTitleVarType>
                        </ArgumentTitle>
                        <ArgumentInput
                            css={css`flex:5`}
                            value={args[argName] ? args[argName].value : defaultValue(type)}
                            name={argName}
                            type={type}
                            onChange={this.handleChangeValue}
                            onChangeByteVectorType={this.handleChangeByteVectorType}
                        />
                    </ArgumentItem>
                )}
            </ArgumentsLayout>
            }
            <FlexBlock>
                <AttachPaymentItems>
                    {this.state.payments.map(({assetId, tokens}, i) => {
                        const decimals = (accountStore!.assets[assetId]
                            && (accountStore!.assets[assetId].decimals || accountStore!.assets[assetId].decimals === 0))
                            ? accountStore!.assets[assetId].decimals
                            : 8;
                        return <AttachPaymentItem key={i}>
                            <ArgumentTitle>
                                <ArgumentTitleVarName>Payments:</ArgumentTitleVarName>
                                &nbsp;
                                <ArgumentTitleVarType>{i + 1}/2</ArgumentTitleVarType>
                            </ArgumentTitle>
                            <Select onChange={this.handleChangePaymentAsset(i)} value={assetId}>
                                {Object.values(accountStore!.assets).map(({assetId, name}) =>
                                    <Option key={assetId} value={assetId}>
                                        <Tooltip placement="right" trigger={['hover']} overlay={<span>{assetId}</span>}>
                                            <div>{name}({centerEllipsis(assetId, 6)})</div>
                                        </Tooltip>
                                    </Option>)}
                            </Select>
                            <InputNumber
                                min={0}
                                step={(new Decimal(10).pow(-decimals)).toNumber()}
                                onChange={this.handleChangePaymentCount(i)}
                                value={String(tokens)}
                                onBlur={this.handleBlurPaymentCount(i)}
                                spellCheck={false}
                            />
                            <Close onClick={this.handleRemoveAttach(i)}/>
                        </AttachPaymentItem>;
                    })}
                </AttachPaymentItems>
                {payments.length < 2 && <AttachPaymentBtn><Attach
                    onClick={this.handleAddAttach}/></AttachPaymentBtn>}
            </FlexBlock>
        </Root>;
    }
}


const defaultValue = (type: ICallableArgumentType) => type === 'String' || type === 'ByteVector' ? '' : undefined;
