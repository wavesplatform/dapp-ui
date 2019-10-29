/** @jsx jsx **/
import React from "react";
import { css, jsx } from '@emotion/core'
import { inject, observer } from "mobx-react";
import styled from "@emotion/styled";
import { autorun, computed } from "mobx";
import { AccountStore, DappStore } from "@stores/index";
import { IMeta } from "@stores/DappStore";
import { Logo } from "@src/assets/icons/Logo";
import Account from "@components/Home/Account";
import Search from "@components/Search";
import EmptyDapp from "@components/DappUi/EmptyDapp";
import DappBody from "@components/DappUi/DappBody";
import { fonts } from "@src/styles";

const styles = {
    root: css`
background: linear-gradient(152.04deg, #FFFFFF 9.12%, #F0F7FC 104.06%);
height: 100%;
width: 100%;
display: flex;
padding: 30px 10% 30px 0`,
};

interface IInjectedProps {
    accountStore?: AccountStore
    dappStore?: DappStore
}

interface IProps extends IInjectedProps {
}

interface IState {
    meta?: IMeta,
    isFailed?: boolean,
    server?: string
}


const Header = styled.div`height: 50px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px`;

const LeftPanel = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 20%
`;


const MenuItem = styled.div`
height: 40px;
width: calc(100% - 20px);
display: flex;
align-items: center;
justify-content: flex-end;  
padding-right: 20px;
${fonts.menuFont}
:hover{
color: #3A3E46;
background: #E9EFFF;
}
`;

const MainPanel = styled.div`width: 70%`;

@inject('accountStore', 'dappStore')
@observer
export default class DappUi extends React.Component<IProps, IState> {
    state: IState = {};

    async componentDidMount() {
        await this.updateMeta();
    }

    updateMeta() {
        const pathname = window.location.pathname.replace('/', '');
        autorun((reaction) => {
            const {network} = this.props.accountStore!;
            if (network) {
                this.setState({server: network.server});
                this.props.dappStore!.getDappMeta(pathname, network.server).then(res => {
                    if ('error' in res) {
                        this.setState({isFailed: true});
                    } else {
                        this.setState({meta: res.meta, isFailed: false});
                    }
                }).catch(() => {
                    this.setState({isFailed: true});
                });
                reaction.dispose();
            }
        });
    }

    @computed
    get body() {
        const {isFailed, meta} = this.state;
        const pathname = window.location.pathname.replace('/', '');
        const accountStore = this.props.accountStore!;
        const server = accountStore.network && accountStore.network.server;
        if (server !== this.state.server) this.updateMeta();
        switch (true) {
            case isFailed || !pathname || !accountStore.isWavesKeeperInstalled || !accountStore.network:
                return <EmptyDapp/>;
            case meta !== undefined:
                return <DappBody address={pathname} callableFuncTypes={(meta as IMeta).callableFuncTypes}/>;
            case meta === undefined:
                return <div css={css`margin: 40%;`}>loading</div>;
            default:
                return null;
        }
    }

    render() {
        const {meta} = this.state;
        return <div css={styles.root}>
            <LeftPanel>
                <Header><Logo/></Header>
                {meta && Object.keys(meta.callableFuncTypes).map(key => <MenuItem key={key}>{key}</MenuItem>)}
            </LeftPanel>
            <MainPanel>
                <Header><Search isHeader/><Account/></Header>
                {this.body}
            </MainPanel>
        </div>
    }

}
