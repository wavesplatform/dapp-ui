/** @jsx jsx*/
import React from 'react';
import { inject, observer } from 'mobx-react';
import AccountStore from '@stores/AccountStore';
import KeeperStore from '@stores/KeeperStore';
import NotificationStore from '@stores/NotificationStore';
import Button from '@components/DappUi/Button';
import { SignerStore } from '@stores/index';
import styled from '@emotion/styled';
import { css, jsx } from '@emotion/core';
import { fonts } from '@src/styles';

interface IProps {
    accountStore?: AccountStore
    signerStore?: SignerStore
    keeperStore?: KeeperStore
    notificationStore?: NotificationStore
}


const Overlay = styled.div`
  background: rgba(0, 0, 0, 0.6);
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Dialog = styled.div`
  background: white;
  width: 500px;
  border-radius: 4px;
  overflow: hidden;
  padding: 30px;
  position: relative;
`;

const Title = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    @include Body-4Basic900Centr;
    padding-bottom: 24px;
`;


const Icon = styled.svg`
    width: 20px;
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    transition-duration: .5s;
    &:hover{
       transform: scale(1.1);
    }
`;

const Body = styled.div`
    display: flex;
    justify-content:space-around;
    height: 100%;
    margin: 0 -4px ;
    & > *  {
    margin: 0 4px ;
    flex: 1;
    }
`;

const Description = styled.div`
${fonts.footerFont};
//text-align: left;
`;


@inject('accountStore', 'notificationStore', 'signerStore', 'keeperStore')
@observer
export default class SignDialog extends React.Component <IProps> {

    handleCloseDialog = () => this.props.notificationStore!.isOpenLoginDialog = false;

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleSignWithKeeper = () => {
        this.handleCloseDialog();
        const keeperStore = this.props.keeperStore!;
        if (keeperStore!.isWavesKeeperInstalled && !keeperStore!.isWavesKeeperInitialized) {
            keeperStore!.setupSynchronizationWithWavesKeeper();
        }
        keeperStore.login()
            .catch(e => this.props.notificationStore!.notify(
                <a href="https://wavesplatform.com/technology/keeper"  target="_blank" rel="noopener noreferrer">
                    install WavesKeeper</a>,
                {type: 'error', title: 'keeper is not installed'})
            );
    };

    handleSignWithExchange = () => {
        this.handleCloseDialog();
        this.props.signerStore!.login();
    };

    handleClickOutside = (event: any) => {
        const path = event.path || event.composedPath();
        if (!(path.some((element: any) => element.dataset && element.dataset.owner === 'sign'))) {
            this.handleCloseDialog();
        }
    };

    render(): React.ReactNode {
        const open = this.props.notificationStore!.isOpenLoginDialog;
        const isKeeper = this.props.keeperStore!.isBrowserSupportsWavesKeeper;
        if (!open) return null;
        return <Overlay>
            <Dialog data-owner={'sign'}>
                <CloseIcon onClick={this.handleCloseDialog}/>
                <Title>Connect a wallet to get started</Title>
                <Body>
                    <div>
                        <Button css={css`width: 100%`} onClick={this.handleSignWithKeeper} disabled={!isKeeper}>
                            Sign in with Keeper
                        </Button>
                        <Description css={!isKeeper && css`color: #EF7362`}>
                            <br/>{
                            isKeeper
                                ? 'The network will be chosen in WavesKeeper by user'
                                : 'Waves Keeper doesn’t support this browser'
                        }</Description>
                    </div>
                    <div>
                        <Button css={css`width: 100%`} onClick={this.handleSignWithExchange} disabled>
                            Sign in with Exchange</Button>
                        {/*<Description><br/>The network will be MainNet by default</Description>*/}
                        <Description><br/>Will be available soon</Description>
                    </div>
                </Body>
            </Dialog>
        </Overlay>;
    }
}

const CloseIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) =>
    <Icon {...props} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g id="Group 7">
            <rect id="Rectangle" width="21" height="1"
                  transform="matrix(-0.707107 0.707107 0.707107 0.707107 15.504 0.194214)" fill="black"></rect>
            <rect id="Rectangle_2" x="1.36194" y="0.194214" width="21" height="1"
                  transform="rotate(45 1.36194 0.194214)"
                  fill="black"></rect>
        </g>
    </Icon>;
