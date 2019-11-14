import * as React from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';
import { Provider as MobxProvider } from 'mobx-react';
import { RootStore } from '@stores';
import App from '@components/App';
import './index.css'
import 'rc-notification/assets/index.css'
const mobXStore = new RootStore();

const history = createBrowserHistory();

render(<MobxProvider {...mobXStore}>
    <App history={history}/>
</MobxProvider>, document.getElementById('root'));
