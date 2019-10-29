/** @jsx jsx */
import React from "react";
import { Wifi } from "@src/assets/icons/Wifi";
import Avatar from "@components/Avatar";
import styled from "@emotion/styled";
import { fonts } from "@src/styles";
import { css, jsx } from "@emotion/core";
import { inject, observer } from "mobx-react";
import { AccountStore } from "@stores/index";
import SignBtn from "@components/SignBtn";

const AccountDescription = styled.div`display: flex;flex-direction: column;justify-content: space-between;height: 100%;`;
const Root = styled.div`display: flex;height: 38px;justify-content: space-between;align-items: center;`;

interface IProps {
    accountStore?: AccountStore
}

@inject('accountStore')
@observer
export default class Account extends React.Component<IProps> {
    render() {
        const {wavesKeeperAccount, network} = this.props.accountStore!;
        return wavesKeeperAccount && network
            ? <Root>
                <AccountDescription>
                    <div css={fonts.addressFont}>{wavesKeeperAccount.address}</div>
                    <div css={[fonts.descriptionFont, css`display: flex;justify-content: flex-end`]}>
                        <Wifi/>
                        {getNetwork(network.server)}</div>
                </AccountDescription>
                <Avatar address={wavesKeeperAccount.address}/>
            </Root>
            : <SignBtn>
                <div css={css`cursor: pointer`}>Sign in with wavesKeeper</div>
            </SignBtn>


    }
}


const getNetwork = (url: string) => {
    switch (url) {
        case 'https://pool.testnet.wavesnodes.com/':
            return <p css={css`border-bottom:1px  #9BA6B1  dashed;`}>TestNet</p>;
        default:
            return ''
    }
};

