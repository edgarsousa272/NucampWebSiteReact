import React, { Component } from 'react';
import Main from './components/MainComponent';
import {BrowserRouter} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';
import './App.css';

const store = ConfigureStore();

class App extends Component {
  render() {
//passing data. by directory
      return (
//making the store available for all connect store that are children of App.
        <Provider store={store}>
        <BrowserRouter>
            <div className="App">
                <Main />
            </div>
        </BrowserRouter>
    </Provider>
      );
  }
}

export default App;
