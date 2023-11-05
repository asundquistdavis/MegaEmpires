import React, { useState } from "react";
import Header from "../components/Header";
import '/frontend/styles/auth.scss'

export default function Auth (props) {

    const { appState, setAppState } = props;
    const [authState, setAuthState] = useState({
        email: ''
    });

    const changeUsername = (event) => {
        setAuthState(state=>({...state, email: event.target.value}));
    };
    const submitLogIn = (event) => {setAppState(state=>({...state, userId: 1}))}; // userId 1 is override
    const submitRegister = (event) => {setAppState(state=>({...state, userId: 1}))};

    return <>
        <Header className='mb--2pc'>Mega Empires</Header>
        <div className="authBody">
            <div className="authEmailRow">
                <label className="authEmailLabel">Username:</label>
                <input id="usernameField" className="authEmailInput" value={authState.email} onChange={changeUsername}/>
            </div>
            <div className="submitRow">
                <button className="login" onClick={submitLogIn}>Login</button>
                <button className="register" onClick={submitRegister}>Register</button>
            </div>
        </div>
    </>;
};
