import React, { useEffect, useState } from "react";
import '/frontend/styles/reset.scss'
import '/frontend/styles/main.scss'
import PlayGame from "./Pages/PlayGame";
import AuthState from "./Pages/Auth";
import PreGame from "./Pages/PreGame";
import MapCreater from "./Pages/MapCreater";
import ChooseGameState from "./Pages/ChooseGame";
import Base from "./components/Base";
import axios from "axios";
import Modal from "./components/Modal";
import { setServerState } from "./utilities";

const App = () => {

    const appState = useAppState();
    
    return <>
        <Base>
            {appState.render(appState)}
        </Base>
    </>;
};

export default App;

const useAppState = () => {
    const [appState, setAppState] = useState({
        name: null,
        token: null,
        pageState: null,
        setState: null,
        error: 0,
        render: ()=><></>,
        user: null,
    });

    useEffect(()=>{console.log(appState)});

    useEffect(()=>{
        // update local storage 'token' if token changes
        if (appState.token) {localStorage.setItem('token', appState.token)};
    }, [appState.token]);

    // define loading state
    const loadState = () => ({
        name: 'loading',
        token: localStorage.getItem('token'),
        pageState: {render(_) {return <>Loading...</>}},
        setState: setAppState,
        render(){return this.pageState.render(this)}
    });

    const getUser = () => setServerState(user=>setAppState(state=>({...state, user})), error=>setAppState(state=>({...state, error})), 'choose/user', {token: appState.token}, {userId: 0, username: 'test', games: [{gameId: 0, hostId: 0, hostUsername: 'test', status: 'pregame', numberOfPlayers: 7, maxNumberOfPlayers: 9}]});

    useEffect(()=>{
        // initiate loading state if there is no state
        if (!appState.name) {setAppState(_=>({...loadState()}))};
        // move to auth if there is no token
        if (appState.name && appState.name!=='auth' && !appState.token) {setAppState(state=>({...state, ...AuthState.new(setAppState)}))}
        // more to load state from auth if there is a token 
        if (appState.name==='auth' && appState.token) {setAppState(_=>({...loadState()}))}
        // get user info if there is a token
        if (appState.name && appState.name!=='auth' && appState.token) {getUser()}
        // go to choose game from load if there is user
    }, [appState.name, appState.token]);

    useEffect(()=>{
        if (appState.user) {
            setAppState(state=>({...state, ...ChooseGameState.new(setAppState, appState.user)}))
        }
    }, [appState.user]);

    return appState
};


//setAppState(state=>({...state, ...ChooseGameState.new(setAppState, appState.user)}))
