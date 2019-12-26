/** @jsx jsx **/
import React from "react";
import { css, jsx } from '@emotion/core'
import { inject, observer } from "mobx-react";
import styled from "@emotion/styled";
import { AccountStore, DappStore, HistoryStore, MetaStore } from "@stores/index";
import DappBody from "@components/DappUi/DappBody";
import NotificationStore from "@stores/NotificationStore";
import Head from "@components/Head";
import ScrollBar from 'react-perfect-scrollbar'
import { fonts } from "@src/styles";
import Footer from "@components/Footer";

const Root = styled.div`
background: linear-gradient(152.04deg, #FFFFFF 9.12%, #F0F7FC 104.06%);
position: fixed;top: 0;left: 0;right: 0;
height: 100%;
`

const Anchor = styled.a`
height: 40px;
width: calc(100% - 20px);
display: flex;
align-items: center;
justify-content: flex-end;
padding-right: 20px;
cursor: pointer;
text-decoration: none;
    outline: none;
${fonts.menuFont}
:hover{
color: #3A3E46;
}
`

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


// const Header = styled.div`height: 50px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px`;
//
// const LeftPanel = styled.div`
// display: flex;
// flex-direction: column;
// align-items: center;
// width: 20%;
// overflow-y: scroll;
// ::-webkit-scrollbar {
//     width: 0 !important;
//     height: 0;
//     background: transparent;
// };
// ::-webkit-scrollbar-thumb {
//     background: transparent;
// };
// scrollbar-width: none;
// -ms-overflow-style: none;
//
// `;
//
// const LeftHeaderCol = styled.div`
// display: flex;
// flex-direction: column;
// align-items: center;
// width: 20%;
// `
//
//
// const MainPanel = styled.div`
// //max-height: calc(100vh - 130px);
// //overflow-y: scroll;
// //width: 100%;
// //padding-right: 10%;
// //display: flex;
// //justify-content: space-between;
// //flex-direction: column
// `;
//
//
// const RightHeaderRow = styled.div`
// width: 100%;
// padding-right: 10%;
// `

const anchorWrapperStyle = css`
position: fixed;
top:100px;
left: 0;
z-index: 2;
width: 30%;
height: 100%;
`;

const Sep = styled.div`height: 100px; flex-shrink: 0;`

const contentWrapperStyle = css`
padding: 0 10% 0 30%; 
display: flex;
flex-direction: column;
`;

@inject('accountStore', 'dappStore', 'notificationStore', 'metaStore', 'historyStore')
@observer
class DappUi extends React.Component<IProps, IState> {
    private containerRef?: HTMLElement;

    private setRef = (ref: HTMLElement) => {
        this.containerRef = ref
    };

    componentDidMount(): void {
        // const {currentHash} = this.props.historyStore!;
        // let lastID: string, h = 0, ok = true;
        // currentHash && this.containerRef && this.containerRef.childNodes
        //     .forEach(({firstChild, clientHeight}: any) => {
        //     if (!ok || !firstChild || !('id' in firstChild) || firstChild.id === '') return;
        //     lastID = firstChild.id;
        //     h += clientHeight;
        //     if (lastID === currentHash) {
        //         console.log(h)
        //         this.containerRef!.scrollTo({top: h})
        //     }
        // })
        // this.props.metaStore!.updateMeta()
    }


    scrollHandler = (container: HTMLElement) => {
        const {history, currentHash} = this.props.historyStore!;
        let lastID: string, h = 0, ok = true;

        container.childNodes.forEach(({firstChild, clientHeight}: any) => {
            if (!ok || !firstChild || !('id' in firstChild) || firstChild.id === '') return;
            lastID = firstChild.id;
            h += clientHeight;
            if (container.scrollTop < h) {
                ok = false;
                (lastID && currentHash !== lastID) && history.replace({hash: `#${lastID}`})
            }
        })
    };

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
        const hash = this.props.historyStore!.currentHash;

        return <Root>
            <Head withSearch/>
            <ScrollBar css={anchorWrapperStyle}>
                {meta && meta.callableFuncTypes ? Object.keys(meta.callableFuncTypes).map(key =>
                    <Anchor key={key} href={`#${key}`} css={hash === key && css`background: #E9EFFF`}> {key}</Anchor>
                ) : <div/>}
            </ScrollBar>
            <ScrollBar containerRef={this.setRef} onScrollY={this.scrollHandler} css={contentWrapperStyle}>
                <Sep/>
                {body}
                <Footer/>
            </ScrollBar>
        </Root>
    }

}

export default DappUi
