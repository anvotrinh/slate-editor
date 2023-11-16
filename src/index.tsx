import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import { store } from './store';

const Index = (): JSX.Element => {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
  );
};

ReactDOM.render(<Index />, document.getElementById('mainContent'));
