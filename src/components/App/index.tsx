import React from 'react';
import { inject, observer } from 'mobx-react';
import { AccountStore } from "@stores";
import { Route, Router } from 'react-router-dom';
import DappUi from "@components/DappUi";
import NotificationsStore from "@stores/NotificationStore";
import Home from "@components/Home";
import HistoryStore from "@stores/HistoryStore";

interface IProps {
    accountStore?: AccountStore
    notificationStore?: NotificationsStore
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

    componentDidMount(): void {
        const accountStore = this.props.accountStore!;
        if (accountStore.isBrowserSupportsWavesKeeper) {
            accountStore.setupWavesKeeper();
        } else {
            this.props.notificationStore!.notify('you use unsupported browser', {
                type: 'warning',
                link: "https://wavesplatform.com/technology/keeper",
                linkTitle: 'more'
            });
        }

    }

    render() {
        return <Router history={this.props.historyStore!.history}>
            <Route exact path="/" component={Home}/>
            <Route path="/:string" component={DappUi}/>
        </Router>
    }
}


export default App;
