import React from 'react';
import ReactDOM from 'react-dom';
import 'semantic-ui-css/semantic.min.css';
import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';

import { Provider } from 'react-redux';
import configureStore from './redux/store/configureStore';
import * as serviceWorker from './serviceWorker';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      <Router>
        <App />
      </Router>
    </ErrorBoundary>
  </Provider>,
  document.getElementById('root')
);

serviceWorker.unregister();
