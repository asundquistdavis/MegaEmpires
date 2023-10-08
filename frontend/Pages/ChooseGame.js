import React from "react";
import { GearFill } from "react-bootstrap-icons";
import Header from "../components/Header";
import { title } from "../utilities";
import Button from "../components/Button";
import Settings from "../components/Settings";
import '/frontend/styles/choose.scss';

export default class ChooseGameState {

    static new = (setter, user) => ({name:'choose', pageState: new ChooseGameState(setter, user)})

    constructor(setter, user) {
        this.setter = setter;
        this.user = user;
        this.render = (appState) => ChooseGame(appState);
        this.showSettings = false;
        this.hostUsername = '';
    };

}

const ChooseGame = (appState) => {

    console.log(appState)

    const { pageState } = appState;

    const settingsButton = () => <Button Icon={GearFill} onClick={()=>pageState.setter(state=>({...state, pageState: {...state.pageState, showSettings: !state.pageState.showSettings}}))}/>;

    const gameRow = (game, key) => {

        const players = `${game.numberOfPlayers}/${game.maxNumberOfPlayers}`;

        return <div key={key} className="chooseGameRow">
            <div className="chooseGameHost">Host: {game.hostUsername}</div>
            <div className="chooseGamePlayers">Players: {players}</div>
            <div className="chooseGameStatus">Status: {game.status}</div>
        </div>;
    };

    return <>
        <Header left={''} right={settingsButton()}>{pageState.user.username}</Header>
        <strong>Games:</strong>
        {pageState.user.games.map(gameRow)}
        <div className="chooseAddRow">
            <Button >Join Game</Button>
            <input placeholder="Host Username?" type='text' onChange={(event)=>pageState.setter(state=>({...state, pageState: {...pageState, hostUsername: event.target.value}}))} value={pageState.hostUsername}/>
             or 
            <Button >Host Game</Button>
        </div>
        {pageState.showSettings? Settings(pageState): null}
    </>;
};
