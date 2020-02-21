/** @jsx jsx */
import React from "react";
import { css, jsx } from '@emotion/core'
import Account from "@components/Home/Account";
import styled from "@emotion/styled";
import logo from '@src/assets/icons/logo.svg'
import { fonts } from "@src/styles";
import Input from "@components/Input";
import { inject, observer } from "mobx-react";
import HistoryStore from "@stores/HistoryStore";
import { autorun } from "mobx";
import MenuIcon from '@components/DappUi/MenuIcon';
import { NotificationStore } from '@stores/index';

interface IProps {
    historyStore?: HistoryStore
    notificationStore?: NotificationStore
    withSearch?: boolean
}

const LogoWrapper = styled.div`
display: flex;
width: 20%;
justify-content: center; 
flex-shrink: 0;
@media(max-width: 768px){
  padding-left: 0;
  justify-content: center;
  //width: 50%;
  flex: 3; 
}
`

const Root = styled.div`
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 100px;
          position: fixed;top: 0;left: 0;right: 0;
          z-index: 1;
          padding-left: 10%;
  `;

const DappInputWrapper = styled.div`
display: flex;
 align-items: center;
width: 100%;
white-space: nowrap;

@media(max-width: 1200px){
    align-items: flex-start;
    flex-direction: column;
    margin-right: 20px;
}
@media(max-width: 768px){
display: none;
}
`



@inject('historyStore', 'notificationStore')
@observer
export default class Head extends React.Component<IProps, { value: string }> {

    state = {value: this.props.historyStore!.currentPath};

    componentDidMount() {
        autorun(() => this.setState({value: this.props.historyStore!.currentPath}))
    }

    handleOpenExplorerModal = () => this.props.notificationStore!.isOpenMobileExplorer = true

    handleKeyPress = (e: React.KeyboardEvent) => e.key === 'Enter' && this.props.historyStore!.handleSearch(this.state.value || '');
    handleChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => this.setState({value});

    render() {
        const {value} = this.state;
        return <Root css={ css`background: ${this.props.withSearch
            ? 'linear-gradient(180deg, #F8F9FB 65.31%, rgba(248, 249, 251, 0) 100%);'
            : 'transparent'}`}>

            <MenuIcon onClick={this.handleOpenExplorerModal}/>

            <LogoWrapper><a href="/"><img src={logo} alt={'Logo'}/></a></LogoWrapper>
            {this.props.withSearch &&
            <DappInputWrapper>
                <div css={[fonts.descriptionFont, css`margin-right: 8px`]}>Smart Contract:</div>
                <Input value={value} onKeyPress={this.handleKeyPress} onChange={this.handleChange}  spellCheck={false}/>
            </DappInputWrapper>}
            <Account/>
        </Root>;
    }

}


