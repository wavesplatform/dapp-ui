/** @jsx jsx **/
import React from 'react';
import {autorun} from 'mobx';
import {inject, observer} from 'mobx-react';
import Tooltip from 'rc-tooltip';
import Decimal from "decimal.js";
import {Option} from 'rc-select';
import {css, jsx} from '@emotion/core';
import {ICallableArgumentType} from "@src/interface";
import Attach from '@src/assets/icons/Attach';
import Close from '@src/assets/icons/Close';
import {ArgumentInput} from '@components/DappUi/ArgumentInput';
import Button from '@components/DappUi/Button';
import Select from '@components/Select';
import {centerEllipsis} from '@components/Home/Account';
import InputNumber from '@components/Input/InputNumber';
import {ListArgComponent} from "@components/DappUi/ListArgComponent";
import {isList} from '../helpers';
import {
    Root,
    FlexBlock,
    Header,
    ArgumentsLayout,
    ArgumentItem,
    ArgumentTitle,
    ArgumentTitleVarName,
    ArgumentTitleVarType,
    AttachPaymentBtn,
    AttachPaymentItems,
    AttachPaymentItem,
    Wrapper,
    Title,
    Anchor,
    ButtonsWrapper,
    JsonButton
} from './Styled';

import {IArgumentInput, IProps, IState} from './Card.interface'
import {defaultValue, isValidArg} from './Card.helpers';
import JsonModal from "@components/JsonModal";

@inject('dappStore', 'accountStore')
@observer
export class Card extends React.Component<IProps, IState> {

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
        address: this.props.accountStore!.address,
        isJsonModalOpen: false,
        transactionData: undefined
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
        const invalidArgs = funcArgs.length !== Object.keys(args).length
            || Object.values(args).some((arg) => isValidArg(arg as IArgumentInput))
            || Object.values(args).some(({type, value}) => {
                if (isList(type)) {
                    return Object.values(value!).some((arg) => isValidArg(arg as IArgumentInput));
                } else {
                    return false;
                }
            });

        return invalidPayment || invalidArgs;
    }

    handleAddAttach = () => this.state.payments.length < 10 && this.setState({
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

    handleChangeValue = (name: string, type: ICallableArgumentType | string, value?: string, index?: number) => {
        if (index === undefined) {
            return this.setState({
                args: {
                    ...this.state.args,
                    [name]: {...this.state.args[name], type: (type as ICallableArgumentType), value}
                }
            });
        } else {
            const newArgArray = this.state.args[name].value as IArgumentInput[]
            newArgArray[index] = {...newArgArray[index], value, type: (type as ICallableArgumentType)}
            return this.setState({
                args: {
                    ...this.state.args,
                    [name]: {
                        ...this.state.args[name],
                        value: [...newArgArray]
                    }
                }
            })
        }
    };

    handleChangeByteVectorType = (name: string, byteVectorType: 'base58' | 'base64', index?: number) => {
        if (index === undefined) {
            return this.setState({
                args: {
                    ...this.state.args,
                    [name]: {...this.state.args[name], byteVectorType}
                }
            });
        } else {
            const newArgArray = this.state.args[name].value as IArgumentInput[]
            newArgArray[index] = {...newArgArray[index], byteVectorType}
            return this.setState({
                args: {
                    ...this.state.args,
                    [name]: {
                        ...this.state.args[name],
                        value: [...newArgArray]
                    }
                }
            })
        }
    }


    handleChangeUnionSubType = (name: string, unionSubType: string, index?: number) => {
        // if (index === undefined) {
        //     return this.setState({
        //         args: {
        //             ...this.state.args,
        //             [name]: {...this.state.args[name], unionSubType}
        //         }
        //     });
        // } else {
        //     const newArgArray = this.state.args[name].value as IArgumentInput[]
        //     newArgArray[index] = {...newArgArray[index], unionSubType}
        //     return this.setState({
        //         args: {
        //             ...this.state.args,
        //             [name]: {
        //                 ...this.state.args[name],
        //                 value: [...newArgArray]
        //             }
        //         }
        //     })
        // }
    }

    handleChangePaymentCount = (i: number) => (v: string | number) => {
        if (isNaN(+v) || +v < 0) {
            return;
        }

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

    handleOpenJsonModal = async () => {
        try {
            const {dappStore, address, funcName: func} = this.props;
            const args = Object.values(this.state.args);
            const data = await dappStore!.getTransactionJson(address, func, args, this.state.payments.map(p => ({
                ...p,
                tokens: +p.tokens
            })));

            this.setState({isJsonModalOpen: true})
            this.setState({transactionData: data})


        } catch (e) {
            console.error(e)
        }
    };


    handleCloseModal = () => this.setState({isJsonModalOpen: false})

    render() {
        const {funcName: title, accountStore} = this.props;
        const {args, payments} = this.state;

        return <Root>
            <Anchor id={title}/>
            <Header>
                <Title title={title.length >= 20 ? title : ''}>{title}</Title>
                <ButtonsWrapper>
                    {(this.props.accountStore?.isAuthorized) ?
                        <JsonButton onClick={this.handleOpenJsonModal} style={{cursor: 'pointer'}}>JSON</JsonButton> : null}
                    {this.state.transactionData && this.state.isJsonModalOpen ?
                        <JsonModal data={this.state.transactionData} handleClose={this.handleCloseModal}/> : null}
                    <Button onClick={this.handleCall} disabled={this.isInvalid}
                            style={{marginLeft: '10px'}}>Invoke</Button>
                </ButtonsWrapper>
            </Header>
            {Object.keys(args).length > 0 &&
            <ArgumentsLayout>
                {Object.entries(args).map(([argName, {type}], i: number) => {
                        return isList(type)
                            ? <ListArgComponent
                                key={i}
                                type={type}
                                argName={argName}
                                values={args[argName].value as IArgumentInput[]}
                                setValue={(value: any) => this.setState({
                                    args: {
                                        ...this.state.args,
                                        [argName]: {type: type, value: value}
                                    }
                                })}
                                setByteVectorType={this.handleChangeByteVectorType}
                                setUnionSubType={this.handleChangeUnionSubType}
                            />
                            :
                            <ArgumentItem key={i}>
                                <ArgumentTitle>
                                    <ArgumentTitleVarName
                                        title={argName.length >= 16 ? argName : ''}>{centerEllipsis(argName, 16)}:</ArgumentTitleVarName>
                                    &nbsp;
                                </ArgumentTitle>
                                <Wrapper>
                                    <ArgumentTitleVarType>{type}</ArgumentTitleVarType>
                                    <ArgumentInput
                                        css={css`width: 90%`}
                                        value={(args[argName] ? args[argName].value : defaultValue(type)) as string | undefined}
                                        name={argName}
                                        type={type}
                                        onChange={this.handleChangeValue}
                                        onChangeByteVectorType={this.handleChangeByteVectorType}
                                        onChangeUnionSubType={this.handleChangeUnionSubType}
                                    />
                                </Wrapper>
                            </ArgumentItem>
                    }
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
                                <ArgumentTitleVarType>{i + 1}/10</ArgumentTitleVarType>
                            </ArgumentTitle>
                            <Select onChange={this.handleChangePaymentAsset(i)} value={assetId}>
                                {Object.values(accountStore!.assets).map(({assetId, name}) =>
                                    <Option key={assetId} value={assetId}>
                                        <Tooltip placement="right" trigger={['hover']} overlay={<span>{assetId}</span>}>
                                            <div title={assetId.length >= 6 ? name + centerEllipsis(assetId, 6) : ''}>
                                                {name}({centerEllipsis(assetId, 6)})
                                            </div>
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
                {payments.length < 10 && <AttachPaymentBtn><Attach
                    onClick={this.handleAddAttach}/></AttachPaymentBtn>}
            </FlexBlock>
        </Root>;
    }
}
