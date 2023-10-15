import React from "react";
import Header from "../components/Header";
import '/frontend/styles/auth.scss'

class AuthState {

    static new = (setter) => ({name: 'auth', token: null, pageState: new AuthState(setter, '', '')});
    
    constructor(setAppState, username, password) {
        this.setAppState = setAppState;
        this.setPageState = setState => this.setAppState(state=>({...state, pageState: setState(state)})); //
        this.username = username;
        this.password = password;
        this.changeUsername = (event) => this.setPageState('username', event.target.value);
        this.changePassword = (event) => this.setPageState('password', event.target.value);
        this.submitLogIn = () => this.setAppState(state=>({...state, token: 'abc'}));
        this.submitRegister = () => console.log('send register');
        this.render = (appState) => Auth(appState);
    };
};

const Auth = (appState) => {

    const {pageState} = appState;

    return <>
        <Header className='mb--2pc'>Mega Empires</Header>
        <div className="authBody">
            <div className="usernameRow">
                <label htmlFor="usernameField" className="usernameLabel">Username:</label>
                <input id="usernameField" className="usernameInput" value={pageState.username} onChange={pageState.changeUsername}/>
            </div>
            <div className="passwordRow">
                <label htmlFor="passwordField" className="passwordLabel">Password:</label>
                <input id="password" className="passwordInput" value={pageState.password} onChange={pageState.changePassword}/>
            </div>
            <div className="submitRow">
                <button className="login" onClick={pageState.submitLogIn}>Login</button>
                <button className="register" onClick={pageState.submitRegister}>Register</button>
            </div>
        </div>
    </>;
};

export default AuthState;
