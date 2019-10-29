import * as React from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider as MobxProvider } from 'mobx-react';
import { RootStore } from '@stores';
import App from '@components/App';
import { loadState, saveState } from "@utils/index";
import { autorun } from "mobx";
import './index.css'
const initState = loadState();
const mobXStore = new RootStore(initState);
autorun(() => {
    console.dir(mobXStore);
    saveState(mobXStore.serialize());
}, {delay: 1000});

const history = createBrowserHistory();

render(<MobxProvider {...mobXStore}>
    <App history={history}/>
</MobxProvider>, document.getElementById('root'));
