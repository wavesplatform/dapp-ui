/** @jsx jsx */
import React from "react";
import { css, jsx } from '@emotion/core'
import { AccountStore } from "@stores/index";
import Account from "@components/Home/Account";
import styled from "@emotion/styled";
import logo from '@src/assets/icons/logo.svg'
interface IProps {
    accountStore?: AccountStore
    withSearch?: boolean
}


const LogoWrapper = styled.div`
flex:1;
display: flex;
@media(max-width: 768px){
  justify-content: center; 
}
`

export default class Head extends React.Component<IProps> {

    render() {

        const blurredBg = css`background: linear-gradient(180deg, #F8F9FB 65.31%, rgba(248, 249, 251, 0) 100%);`

        const Root = styled.div`
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          position: fixed;top: 0;left: 0;right: 0;
          padding: 0 10%;
          ${this.props.withSearch === true && blurredBg};
          margin: -10px;
          z-index: 1;
          & > *{
          margin: 0 10px;
          }
          
          @media(max-width: 768px){
          }
  `;

        return <Root>
            <LogoWrapper ><a href="/"><img src={logo} alt={'Logo'} /></a></LogoWrapper>
            <Account/>
        </Root>;
    }

}


