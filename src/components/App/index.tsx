import React from 'react';
import { inject, observer } from 'mobx-react';
import { AccountStore } from "@stores";
import { Route, Router } from 'react-router-dom';
import DappUi from "@components/DappUi";
import NotificationStore from "@stores/NotificationStore";
import { Home } from "@components";
import HistoryStore from "@stores/HistoryStore";
import SignDialog from '@components/SignDialog';

interface IProps {
    accountStore?: AccountStore
    notificationStore?: NotificationStore
    historyStore?: HistoryStore
}

interface IState {
    collapsedSidebar: boolean
}


@inject('accountStore', 'notificationStore', 'historyStore')
@observer
class App extends React.Component<IProps, IState> {

    state = {
        collapsedSidebar: true
    };

    render() {
        return <Router history={this.props.historyStore!.history}>
            <Route exact path="/" component={Home}/>
            <Route path="/:string" component={DappUi}/>
            <SignDialog/>
        </Router>
    }
}


export default App;
