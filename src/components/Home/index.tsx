/** @jsx jsx **/
import React from "react";
import { css, jsx } from '@emotion/core'
import { fonts } from "@src/styles";
import { inject, observer } from "mobx-react";
import AccountStore from "@stores/AccountStore";
import NotificationsStore from "@stores/NotificationStore";
import { RouteComponentProps, withRouter } from "react-router";
import { base58Decode } from '@waves/ts-lib-crypto'
import { _hashChain } from '@waves/ts-lib-crypto/crypto/hashing'
import Input from "@components/Input";
import { SearchIcn } from "@src/assets/icons/SearchIcn";
import { UnregisterCallback } from "history";
import { Bg } from "@src/assets/icons/Bg";
import Head from "@components/Head";


const styles = {
    bg: css`
    height: 100px;
    background: white;
    margin: 0 15%; 
    flex: 1;
    padding: 30px 40px;
    align-items: center;
`,
    littleRoot: css`
    height: 100px;
    background: white;
   
    padding: 30px 40px;
    align-items: center;
`,
    title: css`margin-bottom: 20px;`,
    input: css`display: flex; width: 100%`,
    withSearchIconStyle: css`border-radius: 4px 0  0 4px;`
};

interface IInjectedProps {
    accountStore?: AccountStore
    notificationStore?: NotificationsStore
}

interface IProps extends IInjectedProps, RouteComponentProps {
    isHeader?: boolean
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
class HomeTemp extends React.Component<IProps, IState> {

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
        const {isHeader} = this.props;
        const {value} = this.state;
        return <Bg>
            <Head/>
            {isHeader
                ? <div css={css`display: flex; align-items: center; width: 490px;white-space: nowrap`}>
                    <div css={[fonts.descriptionFont, css`margin-right: 8px`]}>Smart Contract:</div>
                    <Input onKeyPress={this.handleKeyPress} value={value} onChange={this.handleChange}/>
                </div>
                : <div css={styles.bg}>
                    <div css={[fonts.searchTitleFont, styles.title]}>Search for Smart Contract</div>
                    <div css={styles.input}>
                        <Input onKeyPress={this.handleKeyPress} css={styles.withSearchIconStyle} value={value}
                               onChange={this.handleChange}/>
                        <SearchIcn onClick={() => this.handleSearch(value)}/>
                    </div>
                </div>}
        </Bg>
    }

}


const Home = withRouter((props: IProps) => <HomeTemp {...props}/>);
export default Home;


