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
import Footer from "@components/Footer";
import { getExplorerLink } from "@utils/index";
import EmptyDapp from './EmptyDapp'
import { Explorer } from "@components/DappUi/Explorer";
import Loading from "@components/DappUi/Loading";
import MenuIcon, {MenuWrapper} from "@components/DappUi/MenuIcon";
import Modal from "@components/DappUi/Modal";
import { Collapse } from 'react-collapse';

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
    open: boolean
}

const Root = styled.div`
background: linear-gradient(152.04deg, #FFFFFF 9.12%, #F0F7FC 104.06%);
position: fixed;top: 0;left: 0;right: 0;
height: 100%;
`;

const Sep = styled.div`height: 100px; flex-shrink: 0;`;

const contentWrapperStyle = css`
padding: 0 10% 0 30%; 
display: flex;
flex-direction: column;
@media(max-width: 768px){
  padding: 0 2vw;
}
`;

const Mobile = styled.div`
display: none;
@media(max-width: 768px){
display: block;
}
 
`;
const Desktop = styled.div`
display: block;
@media(max-width: 768px){
display: none;
}
 
`;

@inject('accountStore', 'dappStore', 'notificationStore', 'metaStore', 'historyStore')
@observer
class DappUi extends React.Component<IProps, IState> {
    private containerRef?: HTMLElement;

    private setRef = (ref: HTMLElement) => {
        this.containerRef = ref
    };

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

    state = {open: false};

    handleOpenModal = () => this.setState({open: true});

    handleCloseModal = () =>{
        this.setState({open: false});
    }

    render() {
        const {isFailed, meta, invalidMeta, byte} = this.props.metaStore!;
        const pathname = this.props.historyStore!.currentPath;
        let body = null;

        if (meta === undefined) {
            body = <Loading>Loading</Loading>
        }

        if (isFailed || invalidMeta) {
            const link = <a target="_blank" rel="noopener noreferrer" href={getExplorerLink(byte, pathname, 'address')}>
                Browse in WavesExplorer
            </a>;
            body = <EmptyDapp description={
                invalidMeta
                    ? <div>The deployed dApp doesn't contain meta information about its content.<br/>{link}</div>
                    : <div>The address doesn't contain dApp script.<br/>{link}</div>
            }/>;
        }
        if (meta !== undefined) {
            body = <DappBody address={pathname} callableFuncTypes={meta.callableFuncTypes}/>;
        }
        const hash = this.props.historyStore!.currentHash;

        return <Root>

            <Head withSearch/>
            <MenuWrapper>
                <MenuIcon onClick={this.handleOpenModal}/>
            </MenuWrapper>
            <Mobile>
                <Collapse isOpened={this.state.open}>
                    <Modal handleClose={this.handleCloseModal}>
                        <Explorer onSelect={this.handleCloseModal} meta={meta} hash={hash}/>
                    </Modal>
                </Collapse>

            </Mobile>
            <Desktop>
                <Explorer meta={meta} hash={hash}/>
            </Desktop>
            <ScrollBar containerRef={this.setRef} onScrollY={this.scrollHandler} css={contentWrapperStyle}>
                <Sep/>
                {body}
                <Footer/>
            </ScrollBar>
        </Root>
    }

}


export default DappUi
