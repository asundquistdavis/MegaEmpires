import React from "react";
import { GearFill, Map } from "react-bootstrap-icons";
import Header from "../components/Header";
import Button from "../components/Button";
import Settings from "../components/Settings";
import '/frontend/styles/choose.scss';
import { setServerState } from "../utilities";
import MapCreatorState from "./MapCreator";

export default class ChooseGameState {

    static new = (setter, user) => ({name:'choose', pageState: new ChooseGameState(setter, user)})

    constructor(setAppState, user) {
        this.setAppState = setAppState;
        this.setPageState = (setState) => this.setAppState(appState=>({...appState, pageState: setState(appState.pageState)}))
        this.user = user;
        this.render = (appState) => ChooseGame(appState);
        this.showSettings = false;
        this.hostUsername = '';
    };

}

const ChooseGame = (appState) => {

    const { pageState } = appState;


    const gameRow = (game, key) => {

        const players = `${game.numberOfPlayers}/${game.maxNumberOfPlayers}`;
        const status = game.status==='pregame'? 'Lobby': game.status==='playing'? 'Playing': game.status==='adjourned'? 'Paused': 'Finished';
        const action = 
            game.status==='pregame'? <Button onClick={()=>handleChooseGame('selecctgame', game.gameId)}>View</Button>:
            game.status==='playing'? <Button onClick={()=>handleChooseGame('selecctgame', game.gameId)}>Play</Button>: 
            game.status==='adjourned'? <Button onClick={()=>handleChooseGame('selecctgame', game.gameId)}>View</Button>: 
            <Button onClick={()=>handleChooseGame('selecctgame', game.gameId)}>Review</Button>;

        return <div key={key} className="chooseGameRow">
            <div className="chooseGameHost"><strong>Host: </strong>{game.hostUsername}</div>
            <div className="chooseGameStatus"><strong>Status: </strong>{status}</div>
            <div className="chooseGamePlayers"><div className="chooseGamePlayersPill">{players}</div>Players</div>
            {action}
        </div>;
    };

    const handleChooseGame = (type, gameId=0, hostUsername='') => {
        const setter = (game) => pageState.setAppState(state=>({...state, game: game}));
        const errorSetter = (status) => pageState.setAppState(state=>({...state, error: status}));
        const route = '/choose/' + type
        const data = {token: appState.token, hostUsername, gameId}
        const fallback = {gameId: 0, status: 'playing'}
        setServerState(setter, errorSetter, route, data, fallback)
    }; 

    const buttonsRow = 
        <div className="chooseGameButtonsRow">
            <Button onClick={()=>pageState.setAppState(state=>({...state, ...MapCreatorState.new(pageState.setAppState)}))} Icon={Map}/>
            <Button Icon={GearFill} onClick={()=>pageState.setPageState(state=>({...state, showSettings: !state.showSettings}))}/>
        </div>


    return <>
        <Header left={''} right={buttonsRow}>{pageState.user.username}</Header>
        <strong>Games:</strong>
        {pageState.user.games.map(gameRow)}
        <div className="chooseAddRow">
            <Button onClick={()=>handleChooseGame('join', hostUsername=pageState.hostUsername)}>Join Game</Button>
            <input placeholder="Host Username?" type='text' onChange={(event)=>pageState.setPageState(state=>({...state, hostUsername: event.target.value}))} value={pageState.hostUsername}/>
             or 
            <Button onClick={()=>handleChooseGame('host')}>Host Game</Button>
        </div>
        {pageState.showSettings? Settings(pageState): null}
    </>;
};
