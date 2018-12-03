import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { connect, Provider } from 'react-redux';
import { createStore } from 'redux';
import * as serviceWorker from './serviceWorker';

let reducer = function ( state, action) {
    if(action.type === "setSessionID") {
        return {...state, sessionID: action.id}
    }
    if(action.type === "setMessages") {
        let payload = action.msgs
        return {...state, messages: payload}
    }
        return state; 
    }
let store = createStore (
        reducer, 
        { },
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
let contents = (<Provider store={store}>
     <App />
    </Provider>)
ReactDOM.render(contents, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
