import React, { useEffect, useRef, useState } from "react";
import '/frontend/styles/reset.scss';
import '/frontend/styles/main.scss';
import Auth from './pages/Auth'
import PlayGameState from "./Pages/PlayGame";
import PreGameState from "./Pages/PreGame";
import ChooseGame from "./Pages/ChooseGame";
import Base from "./components/Base";
import axios from "axios";
import { axiosCorsConfig, endpoint, setServerState, useServerState } from "./utilities";
import MapEditorState from "./Pages/MapEditor";
import GameEditor from "./Pages/GameEditor";
import PlayGame from "./Pages/PlayGame";

const App = () => {

    const [appState, setAppState] = useAppState();
    
    return <>
        <Base>
            {/* {GameEditor({appState, setAppState})} */}
            <appState.App appState={appState} setAppState={setAppState}/>
        </Base>
        {/* <Error /> */}
    </>;
};

export const loadState = {
    name: 'loading',
    error: 0,
    App: function(props) {return <>Loading...</>},
    userId: null,
    gameId: null,
};

export default App;

const useAppState = () => {

    const [appState, setAppState] = useState({...loadState, userId: localStorage.getItem('userId')});
        
    useEffect(()=>{
        // update local storage 'token' if token changes
        if (appState.userId) {localStorage.setItem('userId', appState.userId)};
    }, [appState.userId]);

    useEffect(()=>{
        console.log(appState.userId, appState.name)
        // move to auth if there is no userId
        if (appState.name!=='auth' && !appState.userId) {setAppState(state=>({...state, name: 'auth', App: Auth}))};
        // go to choose game if there is a userId
        if (appState.name==='loading' && appState.userId && !appState.gameId) {setAppState(state=>({...state, name: 'choose', App: ChooseGame}))};
    }, [appState.name]);

useEffect(()=>{
        // more to load state from auth if there is a userId 
        if (appState.name==='auth' && appState.userId) {setAppState(state=>({...state, ...loadState, userId: state.userId}))};
    }, [appState.userId]);

    useEffect(()=>{
        if (appState.gameId) {
            const userId = appState.userId;
            const gameId = appState.gameId;
            setInterval(()=>{
                setAppState(state=>({...state, name: 'play', App: PlayGame}))
            }, 1000)
        }
    }, [appState]);

    return [appState, setAppState]
};
