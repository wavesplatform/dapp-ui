/** @jsx jsx **/
import React from "react";
import { css, jsx } from '@emotion/core'
import { fonts } from "@src/styles";
import Input from "@components/Input";
import { inject, observer } from "mobx-react";
import AccountStore from "@stores/AccountStore";
import NotificationsStore from "@stores/NotificationStore";
import { RouteComponentProps, withRouter } from "react-router";
import { base58Decode } from '@waves/ts-lib-crypto'
import { _hashChain } from '@waves/ts-lib-crypto/crypto/hashing'

const styles = {
    bg: css`
    height: 100px;
    background: white;
    margin: 15%;
    padding: 30px 40px;
    align-items: center;
`,
    littleRoot: css`
    height: 100px;
    background: white;
    margin: 15%;
    padding: 30px 40px;
    align-items: center;
`,
    title: css`margin-bottom: 20px;`
};

interface IInjectedProps {
    accountStore?: AccountStore
    notificationStore?: NotificationsStore
}

interface IProps extends IInjectedProps, RouteComponentProps {
    isHeader?: boolean
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
class SearchTemp extends React.Component<IProps> {

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

    render() {
        const {isHeader} = this.props;
        return isHeader
            ? <div css={css`display: flex; align-items: center; width: 490px;white-space: nowrap`}>
                <div css={[fonts.descriptionFont, css`margin-right: 8px`]}>Smart Contract:</div>
                <Input
                    defaultValue={window.location.pathname.replace('/', '')}
                    onSubmit={this.handleSearch}
                    uncontrolled
                />
            </div>
            : <div css={styles.bg}>
                <div css={[fonts.searchTitleFont, styles.title]}>Search for Smart Contract</div>
                <Input onSubmit={this.handleSearch} withSearchIcon uncontrolled/>
            </div>
    }

}

const Search = withRouter((props: IProps) => <SearchTemp {...props}/>);
export default Search;
