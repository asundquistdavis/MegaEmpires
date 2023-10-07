import React from "react";
import Header from "../components/Header";
import '/frontend/styles/auth.scss'

const Auth = (authState) => {

    console.log(authState);

    return <>
        <Header className='mb--2pc'>Mea Empires</Header>
        <div className="authBody">
            <div className="usernameRow">
                <label htmlFor="usernameField" className="usernameLabel">Username:</label>
                <input id="usernameField" className="usernameInput" value={authState.username} onChange={authState.changeUsername}/>
            </div>
            <div className="passwordRow">
                <label htmlFor="passwordField" className="passwordLabel">Password:</label>
                <input id="password" className="passwordInput" value={authState.password} onChange={authState.changePassword}/>
            </div>
            <div className="submitRow">
                <button className="login" onClick={authState.submitLogIn}>Login</button>
                <button className="register" onClick={authState.submitRegister}>Register</button>
            </div>
        </div>
    </>;
};

export default Auth;
