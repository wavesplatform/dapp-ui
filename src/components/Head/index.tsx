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


export default class Head extends React.Component<IProps> {

    render() {
        const Root = styled.div`
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100px;
          position: fixed;top: 0;left: 0;right: 0;
          padding: 0 10%;
          background-color: ${this.props.withSearch};
          margin: -10px;
          & > *{
          margin: 0 10px;
          }
  `;

        return <Root>
            <div  css={css`flex:1`} ><a href="/"><img src={logo} alt={'Logo'} /></a></div>
            <Account/>
        </Root>;
    }

}


