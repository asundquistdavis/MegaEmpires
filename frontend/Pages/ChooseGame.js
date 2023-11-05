import React, { useState } from "react";
import { GearFill, Map, MapFill } from "react-bootstrap-icons";
import Header from "../components/Header";
import Button from "../components/Button";
import Settings from "../components/Settings";
import '/frontend/styles/choose.scss';
import { setServerState, title, useServerState } from "../utilities";
import MapEditor from './MapEditor';
import { loadState } from "../App";

export default function ChooseGame(props) {

    const { appState, setAppState } = props;
    const [chooseGameState, setChooseGameState] = useState({
        showSettings: false,
        gameId: '',
    });

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

    const handleChooseGame = (type, gameId='') => {
        const setter = (gameId) => setAppState(state=>({...loadState, userId: state.userId, gameId}));
        const errorSetter = (status) => setChooseGameState(state=>({...state, error: status}));
        const route = '/choose/' + type
        const data = {token: appState.token, gameId}
        const fallback = {gameId: 0, status: 'playing'}
        setServerState(setter, errorSetter, route, data, fallback)
    }; 

    const buttonsRow = 
        <div className="chooseGameButtonsRow">
            <Button onClick={()=>setAppState(state=>({...state, name: 'map', App: MapEditor}))} Icon={MapFill}/>
            <Button Icon={GearFill} onClick={()=>setChooseGameState(state=>({...state, showSettings: !state.showSettings}))}/>
        </div>

    return <> 
        <Header left={''} right={buttonsRow}>{chooseGameState.user? title(chooseGameState.user.handle): 'Loading...'}</Header>
        <strong>Games:</strong>
        {chooseGameState.user?.games.map(gameRow)||'Loading...'}
        <div className="chooseAddRow">
            <Button onClick={()=>handleChooseGame('join', chooseGameState.gameId)}>Join Game</Button>
            <input placeholder="Game Id?" type='number' onChange={(event)=>setChooseGameState(state=>({...state, gameId: event.target.value}))} value={chooseGameState.gameId}/>
             or 
            <Button onClick={()=>handleChooseGame('host')}>Host Game</Button>
        </div>
        {chooseGameState.showSettings? Settings(pageState): null}
    </>;
};
