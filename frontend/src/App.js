import React, { Component } from 'react';
import logo from './logo.svg';
import Authentication from './Authentication'
import { connect } from 'react-redux'
import './App.css';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      activeUsers: []
    }
    this.updateMessages = this.updateMessages.bind(this)
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.getActiveUsers = this.getActiveUsers.bind(this)
  }
  componentDidMount() {
    setInterval(this.updateMessages, 500) 
    setInterval(this.getActiveUsers, 1000)
    }
 getActiveUsers () {
      let cb = function(resBody) {
        let parsed = JSON.parse(resBody)
        this.setState({activeUsers: parsed})
      }
      cb = cb.bind(this)
      fetch('/activeUsers')
      .then(function(res){
          return res.text()
        }).then(cb)
    }
  updateMessages() {
    let cb = function(resBody) {
     let parsed = JSON.parse(resBody) 
      this.props.dispatch({type: "setMessages", msgs: parsed})
      }
      cb = cb.bind(this)
    fetch('/getAllMessages')
  .then(function(res) {
    return res.text()
  }).then(cb)
  }
  displayMessages() {
  return this.props.messages.map(function(msg) {
    return (<div>
      {msg.username} {msg.message}
      </div>)
  })
}
handleInputChange(m) {
    this.setState({messageContents: m.target.value})
}
handleSubmit(n) {
  n.preventDefault()
  let body = JSON.stringify({
    msg: this.state.messageContents, 
    sessionID: this.props.id
  })
 
  fetch('/message', {
    method: 'POST',
    credentials: "same-origin",
    body: body 
  }).then(function(res) {
    return res.text()
  }).then(function (resBody) {
    console.log(resBody)
  })
}
  render() {
    if(this.props.id) {
      return  (<div>
        <ul>
          Active users 
          {this.state.activeUsers.map(function(user){return <li>{user}</li>})}
        </ul>
      <div className="topcontainer">
      {this.displayMessages()}
      </div>
      <div className="botcontainer">
          <form onSubmit={this.handleSubmit}>
              <div className="chat">
                  <input onChange={this.handleInputChange} type="text">
                  </input>
                  <input type="submit"></input>
              </div>
          </form>
      </div>
  </div>)
    }
    return (
      <div className="App">
      Signup
        <Authentication endpoint="/signup"></Authentication>
      Login
        <Authentication endpoint="/login"></Authentication> 
      </div>
    );
  }
}

let ConnectedApp = connect(function(store) {
  return { id: store.sessionID, 
         messages: store.messages }
})(App)

export default ConnectedApp;
