import React, { useEffect, useState } from "react";
import '/frontend/styles/reset.scss'
import '/frontend/styles/main.scss'
import PlayGame from "./Pages/PlayGame";
import Auth from "./Pages/Auth";
import PreGame from "./Pages/PreGame";
import MapCreater from "./Pages/MapCreater";
import ChooseGame from "./Pages/ChooseGame";
import Base from "./components/Base";
import axios from "axios";

const NewPage = (newState) => {
    return <>
        Laoding...
    </>
};

class AuthState {

    static new = (setter) => new AuthState(setter, '', '')
    
    constructor(setter, username, password) {
        this.setter = setter;
        this.setState = (stateName, value) => this.setter(state=>({...state, pageState: {...state.pageState, [stateName]: value}})) //
        this.username = username;
        this.password = password;
        this.changeUsername = (event) => this.setState('username', event.target.value);
        this.changePassword = (event) => this.setState('password', event.target.value);
        this.submitLogIn = () => console.log('send log in');
        this.submitRegister = () => console.log('send register');
    };
};

class AppState {

    static new = new AppState(()=>({}), 'new', NewPage, {});
    static auth = (setter) => new AppState(setter, 'auth', Auth, AuthState.new(setter));
    static mapCreater = (setter) => new AppState(setter, 'map', MapCreater, null);
    static chooseGame = (setter) => new AppState(setter, 'choose', ChooseGame, null);
    static preGame = (setter) => new AppState(setter, 'pre', PreGame, null);
    static playGame = (setter) => new AppState(setter, 'play', PlayGame, null);

    constructor(setter, name, page, pageState) {
        this.setter = setter;
        this.name = name;
        this.token = null;
        this.pageState = pageState;
        this.page = page;
    };
    
    render = (pageState) => this.page(pageState);
};

const App = () => {
    
    const [appState, setAppState] = useState(AppState.new);
    
    useEffect(()=>{
        if (appState.name === 'new') {
            const tokenL = localStorage.getItem('token');
            tokenL? setAppState(as=>({...as, token: tokenL})): setAppState(AppState.auth(setAppState));
        };
        if (appState.name === 'auth') {
            console.log(appState)
        }
    }, [appState]);

    return <>
        <Base>
            {appState.render(appState.pageState)}
        </Base>
    </>;
};

export default App;
