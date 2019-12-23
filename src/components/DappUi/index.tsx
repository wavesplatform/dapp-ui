/** @jsx jsx **/
import React from "react";
import { css, jsx } from '@emotion/core'
import { inject, observer } from "mobx-react";
import styled from "@emotion/styled";
import { AccountStore, DappStore, HistoryStore, MetaStore } from "@stores/index";
// import Logo  from "@src/assets/icons/Logo";
// import Search from "@components/Search";
import EmptyDapp from "@components/DappUi/EmptyDapp";
import DappBody from "@components/DappUi/DappBody";
import { fonts } from "@src/styles";
import ScrollIntoView from 'react-scroll-into-view'
import Footer from "@components/Footer";
import NotificationStore from "@stores/NotificationStore";
import { getExplorerLink } from "@utils/index";
import Head from "@components/Head";
import ScrollBar from 'react-perfect-scrollbar'
import ScrollableAnchor from 'react-scrollable-anchor'

const Root = styled.div`
background: linear-gradient(152.04deg, #FFFFFF 9.12%, #F0F7FC 104.06%);
position: fixed;top: 0;left: 0;right: 0;
height: 100%;
`

const styles = {
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
    notificationStore?: NotificationStore
    historyStore?: HistoryStore
    metaStore?: MetaStore
    scrollTo?: (opts: any) => void
}

interface IProps extends IInjectedProps {
}

interface IState {
}


const Header = styled.div`height: 50px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px`;

const LeftPanel = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 20%;
overflow-y: scroll;
::-webkit-scrollbar {
    width: 0 !important;
    height: 0;
    background: transparent;
};
::-webkit-scrollbar-thumb {
    background: transparent;
};
scrollbar-width: none;
-ms-overflow-style: none;

`;

const LeftHeaderCol = styled.div`
display: flex;
flex-direction: column;
align-items: center;
width: 20%;
`


const MainPanel = styled.div`
//max-height: calc(100vh - 130px);
//overflow-y: scroll;
//width: 100%; 
//padding-right: 10%;
//display: flex; 
//justify-content: space-between; 
//flex-direction: column
`;


const RightHeaderRow = styled.div`
width: 100%; 
padding-right: 10%;
`

const Sep = styled.div`height: 100px`

@inject('accountStore', 'dappStore', 'notificationStore', 'metaStore', 'historyStore')
@observer
class DappUi extends React.Component<IProps, IState> {


    // componentDidMount(): void {
    //     this.props.metaStore!.updateMeta()
    // }


    render() {

        const {
            // isFailed,
            meta,
            // invalidMeta, server, byte
        } = this.props.metaStore!;
        const pathname = this.props.historyStore!.currentPath;
        let body = null;
        // if (isFailed || !server || !pathname) {
        //     const link = <a target="_blank" href={getExplorerLink(byte, pathname, 'address')}>Browse in
        //         WavesExplorer</a>;
        //     body = <EmptyDapp description={
        //         invalidMeta
        //             ? <div>The deployed dApp doesn't contain meta information about its content.<br/>{link}</div>
        //             : <div>The address doesn't contain dApp script.<br/>{link}</div>
        //     }/>;
        // }
        if (meta !== undefined) {
            body = <DappBody address={pathname} callableFuncTypes={meta.callableFuncTypes}/>;
        }

        // if (meta === undefined) {
        //     body = <div
        //         css={css`flex: 1;display: flex;justify-content: center;align-items: center;`}>loading</div>;
        // }


        return <Root>
            <Head withSearch/>
            <ScrollBar css={css`
padding: 0 10% 0 20%;

`}>
                <Sep/>
                {body}
            </ScrollBar>
            {/*<div css={css`display: flex`}>*/}
            {/*    <LeftPanel>*/}
            {/*        <Sep/>*/}
            {/*        <div css={css`height: calc(100vh - 130px);width: 100%;`}>*/}
            {/*            {meta && meta.callableFuncTypes && Object.keys(meta.callableFuncTypes).map(key =>*/}
            {/*                <ScrollIntoView css={styles.menuItem} key={key}*/}
            {/*                                selector={`#${key}`}>{key}</ScrollIntoView>)}*/}
            {/*        </div>*/}
            {/*    </LeftPanel>*/}
            {/**/}
            {/*</div>*/}

            {/*<div>*/}
            {/*    <a href='#section1'> Go to section 1 </a>*/}
            {/*    <a href='#section2'> Go to section 2 </a>*/}
            {/*    <ScrollableAnchor id={'section1'}>*/}
            {/*        <div> Hello World </div>*/}
            {/*    </ScrollableAnchor>*/}
            {/*    <ScrollableAnchor id={'section2'}>*/}
            {/*        <div> How are you world? </div>*/}
            {/*    </ScrollableAnchor>*/}
            {/*</div>*/}

        </Root>
    }

}

export default DappUi
