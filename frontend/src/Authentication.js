import React, { Component } from 'react'; 
import { connect } from 'react-redux'

class Authentication extends Component {
    constructor(props) {
    super(props)
    this.state = {
        usernameInput: "",
        passwordInput: ""
      }
      this.handleUsernameChange = this.handleUsernameChange.bind(this)
      this.handlePasswordChange = this.handlePasswordChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }
    handleUsernameChange(n) {
        this.setState({ 
            usernameInput: n.target.value
        })
    }
    handlePasswordChange(n) {
        this.setState({
            passwordInput: n.target.value
        })
    }
    handleSubmit(n) {
        n.preventDefault()
        let body = JSON.stringify({
            username: this.state.usernameInput, 
            password: this.state.passwordInput
        })
        let cb = function(resBody) {
            if( resBody === "username already taken!") {
                return alert(resBody)
            }
            let parsed = JSON.parse(resBody)
            this.props.dispatch({
            type: "setSessionID", 
            id: parsed.id
        })
    }
       cb = cb.bind(this)
        fetch(this.props.endpoint, {
            method: 'POST',
            credentials: "same-origin",
            body: body
        }).then(function(res) {
            return res.text()
        }).then(cb)
}
    render() {
        return (<form onSubmit={this.handleSubmit}>
    <input type="text" onChange={this.handleUsernameChange}></input>
    <input type="text" onChange={this.handlePasswordChange}></input>
    <input type="submit"></input>
        </form>)
    }
}
let ConnectedAuthentication = connect()(Authentication)

export default ConnectedAuthentication 