/** @jsx jsx **/
import React from "react";
import { css, jsx } from '@emotion/core'
import { fonts } from "@src/styles";
import { inject, observer } from "mobx-react";
import AccountStore from "@stores/AccountStore";
import NotificationsStore from "@stores/NotificationStore";
import { RouteComponentProps } from "react-router";
import { base58Decode } from '@waves/ts-lib-crypto'
import { _hashChain } from '@waves/ts-lib-crypto/crypto/hashing'
import Input from "@components/Input";
import { SearchIcn } from "@src/assets/icons/SearchIcn";
import { UnregisterCallback } from "history";
import { Bg } from "@src/assets/icons/Bg";
import Head from "@components/Head";
import styled from "@emotion/styled";


const FormBg = styled.div`
    height: 100px;
    background: white;
    margin: 0 15%; 
    @media(max-width: 768px){
      margin: 0 4%; 
    }
    flex: 1;
    padding: 30px 40px;
    align-items: center;
`;

const Title = styled.div`
  ${fonts.searchTitleFont};
  margin-bottom: 20px;
  @media(max-width: 768px){
    text-align: center; 
  }
`;
const InputWrapper = styled.div`display: flex; width: 100%`;
const withSearchIconStyle = css`border-radius: 4px 0  0 4px;`;


interface IInjectedProps {
    accountStore?: AccountStore
    notificationStore?: NotificationsStore
}

interface IProps extends IInjectedProps, RouteComponentProps {
}

interface IState {
    value: string
}


function isValidAddress(address: string): boolean {

    try {
        const addressBytes = base58Decode(address);
        return (
            addressBytes.length === 26 &&
            addressBytes[0] === 1 &&
            addressBytes.slice(-4).toString() === _hashChain(addressBytes.slice(0, 22)).slice(0, 4).toString()
        )
    } catch (e) {
        console.error(e)
    }
    return false
}

@inject('accountStore', 'notificationStore')
@observer
class Home extends React.Component<IProps, IState> {

    historyUnregisterCallback: null | UnregisterCallback = null;

    state = {value: window.location.pathname.replace('/', '')};


    componentWillMount(): void {
        this.historyUnregisterCallback = this.props.history.listen((location, action) => {
            action === 'POP' && this.setState({value: location.pathname.replace('/', '')})
        });
    }

    componentWillUnmount(): void {
        this.historyUnregisterCallback && this.historyUnregisterCallback()
    }

    handleSearch = (value: string) => {
        if (!isValidAddress(value)) {
            this.props.notificationStore!.notify('invalid address', {type: 'error'});
            return;
        }
        const network = this.props.accountStore!.getNetworkByAddress(value);
        if (network == null) {
            this.props.notificationStore!.notify('Cannot find network', {type: 'error'});
            return;
        }
        const history = this.props.history;
        history.push(value);
    };

    handleKeyPress = (e: React.KeyboardEvent) => e.key === 'Enter' && this.handleSearch(this.state.value || '');

    handleChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => this.setState({value});

    render() {
        const {value} = this.state;
        return <Bg>
            <Head/>
            <FormBg>
                <Title>Search for Smart Contract</Title>
                <InputWrapper>
                    <Input onKeyPress={this.handleKeyPress} css={withSearchIconStyle} value={value}
                           onChange={this.handleChange}/>
                    <SearchIcn onClick={() => this.handleSearch(value)}/>
                </InputWrapper>
            </FormBg>
        </Bg>
    }

}


export default Home;


