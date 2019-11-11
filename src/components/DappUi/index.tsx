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
import ScrollIntoView from 'react-scroll-into-view'
import Footer from "@components/Footer";

const styles = {
    root: css`
background: linear-gradient(152.04deg, #FFFFFF 9.12%, #F0F7FC 104.06%);
min-height: calc(100vh - 60px) ;
//display: flex;
padding: 30px 0`,
    menuItem: css`
height: 40px;
width: calc(100% - 20px);
display: flex;
align-items: center;
justify-content: flex-end;  
padding-right: 20px;
cursor: pointer;
${fonts.menuFont}
:hover{
color: #3A3E46;
background: #E9EFFF;
}
`
};

interface IInjectedProps {
    accountStore?: AccountStore
    dappStore?: DappStore
    scrollTo?: (opts: any) => void
}

interface IProps extends IInjectedProps {
}

interface IState {
    meta?: IMeta,
    isFailed?: boolean,
    server?: string
    byte?: string
}


const Header = styled.div`height: 50px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px`;

const LeftPanel = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 20%;
overflow-y: scroll;
::-webkit-scrollbar {
    width: 0;
    height: 0;
    background: transparent;
}
::-webkit-scrollbar-thumb {
    background: transparent;
}

`;


const MainPanel = styled.div`
max-height: calc(100vh - 130px);
overflow-y: scroll;
width: 100%; 
padding-right: 10%;
display: flex; 
justify-content: space-between; 
flex-direction: column
`;


@inject('accountStore', 'dappStore')
@observer
class DappUi extends React.Component<IProps, IState> {
    state: IState = {};

    async componentDidMount() {
        await this.updateMeta();
    }

    updateMeta() {
        const pathname = window.location.pathname
            .replace('/', '');
        autorun((reaction) => {
            const network = this.props.accountStore!.getNetworkByAddress(pathname);
            if (network) {
                this.setState({server: network.server, byte: network.code});
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
        let server = accountStore.network && accountStore.network.server;
        let byte = accountStore.network && accountStore.network.code;
        if (!server || !byte) {
            const network = this.props.accountStore!.getNetworkByAddress(pathname);
            if (network) {
                server = network.server;
                byte = network.code;
            }
        }
        if (byte !== this.state.byte) this.updateMeta();

        switch (true) {
            case isFailed || !pathname || !this.state.server:
                return <EmptyDapp/>;
            case meta !== undefined:
                return <DappBody address={pathname} callableFuncTypes={(meta as IMeta).callableFuncTypes}/>;
            case meta === undefined:
                return <div
                    css={css`flex: 1;display: flex;justify-content: center;align-items: center;`}>loading</div>;
            default:
                return null;
        }
    }

    render() {
        const {meta} = this.state;
        return <div css={styles.root}>
            <div css={css`display: flex;position: sticky;width: 100%;top: 10px;`}>
                <LeftPanel>
                    <Header><Logo/></Header>
                </LeftPanel>
                <MainPanel>
                    <Header><Search isHeader/><Account/></Header>
                </MainPanel>
            </div>
            <div css={css`display: flex`}>
                <LeftPanel>
                    <div css={css`height: calc(100vh - 130px);width: 100%;`}>
                        {meta && Object.keys(meta.callableFuncTypes).map(key =>
                            <ScrollIntoView css={styles.menuItem} key={key}
                                            selector={`#${key}`}>{key}</ScrollIntoView>)}
                    </div>
                </LeftPanel>
                <MainPanel>
                    {this.body}
                    <Footer/>
                </MainPanel>
            </div>

        </div>
    }

}

export default DappUi
