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

const Root = styled.div`
display: flex;
margin-left: 30px;
height: 38px;
justify-content: flex-end;
align-items: center;
`;

const AccountDescription = styled.div`
display: flex;
flex-direction: column;
justify-content: space-between;
height: 100%;
@media(max-width: 1000px){
  display: none;
}
`;

const Wrapper = styled.div`
width: 70%;
padding-right: 10%;
display: flex;
justify-content: flex-end;

@media(max-width: 768px){
  display: none 
}
`

interface IProps {
    accountStore?: AccountStore
}

const ErrorText = styled.div`
color: #EF7362
`;

const AccountDetailWrapper = styled.div`
${fonts.descriptionFont};
display: flex;
justify-content: flex-end; 
align-items: center;
`;

@inject('accountStore')
@observer
export default class Account extends React.Component<IProps> {
    render() {
        const {wavesKeeperAccount, network} = this.props.accountStore!;
        const pathname = window.location.pathname.replace('/', '');
        const networkByAddress = this.props.accountStore!.getNetworkByAddress(pathname)

        const isInvalidServer = networkByAddress && network && networkByAddress.code !== network.code;

        return <Wrapper>{
            wavesKeeperAccount && network
                ? <Root>
                    <AccountDescription>
                        <div css={fonts.addressFont}>{wavesKeeperAccount.address}</div>
                        <AccountDetailWrapper>
                            <Wifi/>
                            {getNetwork(network.code)}
                            {isInvalidServer && <ErrorText>&nbsp;invalid network</ErrorText>}
                        </AccountDetailWrapper>
                    </AccountDescription>
                    <Avatar address={wavesKeeperAccount.address}/>
                </Root>
                : <SignBtn>
                    <div css={css`cursor: pointer`}>Sign in with wavesKeeper</div>
                </SignBtn>
        }</Wrapper>


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

