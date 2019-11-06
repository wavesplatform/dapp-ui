/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from "react";
import { AccountStore } from "@stores/index";
import { Logo } from "@src/assets/icons/Logo";
import Account from "@components/Home/Account";
import styled from "@emotion/styled";
interface IProps {
    accountStore?: AccountStore

}

const Root = styled.div`
display: flex;
justify-content: space-between;
align-items: center;
height: 60px;
padding: 30px 60px;
`;


export default class Head extends React.Component<IProps> {

    render() {
        return <Root>
            <Logo/>
            <Account/>
        </Root>;
    }

}


