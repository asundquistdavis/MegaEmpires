import React, { useEffect, useState } from "react";
import '/frontend/styles/reset.scss'
import '/frontend/styles/main.scss'
import PlayGameState from "./Pages/PlayGame";
import AuthState from "./Pages/Auth";
import PreGameState from "./Pages/PreGame";
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
        game: null,
    });
    
    // define loading state
    const loadState = () => ({
        name: 'loading',
        token: localStorage.getItem('token'),
        pageState: {render(_) {return <>Loading...</>}},
        setState: setAppState,
        render(){return this.pageState.render(this)}
    });
        
            useEffect(()=>{
                // update local storage 'token' if token changes
                if (appState.token) {localStorage.setItem('token', appState.token)};
            }, [appState.token]);

    const getUser = () => setServerState(user=>setAppState(state=>({...state, user})), error=>setAppState(state=>({...state, error})), '/choose/user', {token: appState.token}, {userId: 4, username: 'test', games: [{gameId: 0, hostId: 0, hostUsername: 'test', status: 'pregame', numberOfPlayers: 7, maxNumberOfPlayers: 9}]});

    const getPreGameGame = () => setServerState(game=>setAppState(state=>({...state, game})), error=>setAppState(state=>({...state, error})), '/pregame/game', {token:appState.token, gameId:appState.game.gameId}, {gameId: 0, hostId:0, hostUsername: 'test', status:'pregame', numberOfPlayers: 7, maxNumberOfPlayers: 9, players: [{type: 'human', userId: 0, username: 'test', civilizationId: 1}, {type: 'human', userId: 1, username: 'test1', civilizationId: 2}, {type: 'human', userId: 2, username: 'test2', civilizationId: 3}, {type: 'human', userId: 3, username: 'test3', civilizationId: 4}, {type: 'human', userId: 4, username: 'test4', civilizationId: 5}, {type: 'ai', userId: 100, username: 'ai', civilizationId: 6}, {type: 'ai', userId: 101, username: 'ai1', civilizationId: 7}], civilizations: [{civilizationId: 1, name: 'minoa', color: 'green', astRank: 1, isTaken: true}, {civilizationId: 2, name: 'saba', color: 'orange', astRank: 2, isTaken: true}, {civilizationId: 3, name: 'celts', color: 'darkgreen', astRank: 3, isTaken: true}, {civilizationId: 4, name: 'romans', color: 'red', astRank: 4, isTaken: true}, {civilizationId: 5, name: 'iberia', color: 'lightgrey', astRank: 5, isTaken: true}, {civilizationId: 6, name: 'hellas', color: 'yellow', astRank: 6, isTaken: true}, {civilizationId: 7, name: 'babylon', color: 'grey', astRank: 7, isTaken: true}, {civilizationId: 8, name: 'assyria', color: 'lightblue', astRank: 8}, {civilizationId: 9, name: 'kushan', color: 'brown', astRank: 9}]})

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
        if (appState.name && appState.name==='pregame') {getPreGameGame()}
        console.log(appState.name)
    }, [appState.name, appState.token]);

    useEffect(()=>{
        if (appState.user && appState.token) {
            setAppState(state=>({...state, ...ChooseGameState.new(setAppState, appState.user)}))
        }
    }, [appState.user]);

    useEffect(()=> {
        if (appState.game) {
            if (appState.game.status==='pregame') {
                setAppState(state=>({...state, ...PreGameState.new(setAppState, appState.game, appState.user)}))
            }
        }
    }, [appState.game]);

    return appState
};


//setAppState(state=>({...state, ...ChooseGameState.new(setAppState, appState.user)}))
