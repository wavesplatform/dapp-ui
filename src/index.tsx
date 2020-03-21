import * as React from 'react';
import { render } from 'react-dom';
import { Provider as MobxProvider } from 'mobx-react';
import { RootStore } from '@stores';
import App from '@components/App';
import 'normalize.css'
import './index.css'
import 'rc-notification/assets/index.css'
import 'react-perfect-scrollbar/dist/css/styles.css';
import 'rc-input-number/assets/index.css';
import 'rc-tooltip/assets/bootstrap.css';

const mobXStore = new RootStore();

render(<MobxProvider {...mobXStore}><App/></MobxProvider>, document.getElementById('root'));
