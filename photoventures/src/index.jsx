import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { BrowserRouter } from 'react-router-dom'

import App from './views/App/App';
import Theme from './theme';
import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider muiTheme={Theme}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('app'),
);