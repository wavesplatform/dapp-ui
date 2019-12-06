/** @jsx jsx */
import { jsx } from '@emotion/core'
import React from "react";
import { SerializedStyles } from "@emotion/core";
import logo from './logo.svg'
import { RouteComponentProps, withRouter } from "react-router";
interface IProps extends RouteComponentProps{
    css?: SerializedStyles
}
const _Logo: React.FunctionComponent<IProps> = ({css, history}) =>
     <img css={[css]} src={logo} alt={'Logo'} onClick={() => history.push('/')}/>


const Logo = withRouter((props: IProps) => <_Logo {...props}/>);
export default Logo
