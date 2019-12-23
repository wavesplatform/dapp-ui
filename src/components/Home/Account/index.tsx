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
const Root = styled.div`
flex:1;
display: flex;
height: 38px;
justify-content: flex-end;
align-items: center;
`;

interface IProps {
    accountStore?: AccountStore
}

const ErrorText = styled.div`
color: #EF7362
`

@inject('accountStore')
@observer
export default class Account extends React.Component<IProps> {
    render() {
        const {wavesKeeperAccount, network} = this.props.accountStore!;
        const pathname = window.location.pathname.replace('/', '');
        const networkByAddress = this.props.accountStore!.getNetworkByAddress(pathname)

        const isInvalidServer = networkByAddress && network && networkByAddress.code !== network.code;

        return <div css={css`@media(max-width: 768px){display: none }`}>{
            wavesKeeperAccount && network
                ? <Root>
                    <AccountDescription>
                        <div css={fonts.addressFont}>{wavesKeeperAccount.address}</div>
                        <div
                            css={[fonts.descriptionFont, css`display: flex;justify-content: flex-end; align-items: center`]}>
                            <Wifi/>
                            {getNetwork(network.code)}
                            {isInvalidServer && <ErrorText>&nbsp;invalid network</ErrorText>}
                        </div>
                    </AccountDescription>
                    <Avatar address={wavesKeeperAccount.address}/>
                </Root>
                : <SignBtn>
                    <div css={css`cursor: pointer`}>Sign in with wavesKeeper</div>
                </SignBtn>
        }</div>


    }
}


const getNetwork = (url: string) => {
    switch (url) {
        case 'T':
            return <p css={css`border-bottom:1px  #9BA6B1  dashed;`}>TestNet</p>;
        case 'W':
            return <p css={css`border-bottom:1px  #9BA6B1  dashed;`}>MainNet</p>;
        case 'S':
            return <p css={css`border-bottom:1px  #9BA6B1  dashed;`}>StageNet</p>;
        default:
            return <p css={css`border-bottom:1px  #9BA6B1  dashed;`}>Custom</p>
    }
};

