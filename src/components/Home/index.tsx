/** @jsx jsx **/
import React from "react";
import { css, jsx } from '@emotion/core'
import { fonts } from "@src/styles";
import { inject, observer } from "mobx-react";
import AccountStore from "@stores/AccountStore";
import NotificationStore from "@stores/NotificationStore";
import { RouteComponentProps } from "react-router";
import Input from "@components/Input";
import { SearchIcn } from "@src/assets/icons/SearchIcn";
import { UnregisterCallback } from "history";
import { Bg } from "@src/assets/icons/Bg";
import Head from "@components/Head";
import styled from "@emotion/styled";
import HistoryStore from "@stores/HistoryStore";


const FormBg = styled.div`
    height: 100px;
    background: white;
    margin: 0 15%; 
    @media(max-width: 768px){
      margin: 0 4%; 
    }
    flex: 1;
    padding: 30px 40px;
    align-items: center;
`;

const Title = styled.div`
  ${fonts.searchTitleFont};
  margin-bottom: 20px;
  @media(max-width: 768px){
    text-align: center; 
  }
`;
const InputWrapper = styled.div`display: flex; width: 100%`;
const withSearchIconStyle = css`border-radius: 4px 0  0 4px;`;


interface IInjectedProps {
    accountStore?: AccountStore
    notificationStore?: NotificationStore
    historyStore?: HistoryStore
}

interface IProps extends IInjectedProps, RouteComponentProps {
}

interface IState {
    value: string
}



@inject('accountStore', 'notificationStore', 'historyStore')
@observer
class Home extends React.Component<IProps, IState> {

    historyUnregisterCallback: null | UnregisterCallback = null;

    state = {value: window.location.pathname.replace('/', '')};


    componentWillMount(): void {
        this.historyUnregisterCallback = this.props.history.listen((location, action) => {
            action === 'POP' && this.setState({value: location.pathname.replace('/', '')})
        });
    }

    componentWillUnmount(): void {
        this.historyUnregisterCallback && this.historyUnregisterCallback()
    }



    handleKeyPress = (e: React.KeyboardEvent) => e.key === 'Enter' && this.props.historyStore!.handleSearch(this.state.value || '');

    handleChange = ({target: {value}}: React.ChangeEvent<HTMLInputElement>) => this.setState({value});

    render() {
        const {value} = this.state;
        return <Bg>
            <Head/>
            <FormBg>
                <Title>Search for Smart Contract</Title>
                <InputWrapper>
                    <Input onKeyPress={this.handleKeyPress} css={withSearchIconStyle} value={value}
                           onChange={this.handleChange} spellCheck={false}/>
                    <SearchIcn onClick={() => this.props.historyStore!.handleSearch(value)}/>
                </InputWrapper>
            </FormBg>
        </Bg>
    }

}


export default Home;


