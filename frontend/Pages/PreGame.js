import React, { useEffect, useState } from "react";
import '/frontend/styles/pregame.scss'
import Header from "../components/Header";
import Button from "../components/Button";
import { ArrowLeftCircleFill, GearFill, PersonFill, Robot, StarFill } from "react-bootstrap-icons";
import Settings from "../components/Settings";
import { setServerState, title } from "../utilities";
import Chat from "../components/Chat";

export default class PreGameState {

    static new = (setter, game, user) => ({name:'pregame', pageState: new PreGameState(setter, game, user)});

    constructor(setAppState, game, user) {
        this.setAppState = setAppState;
        this.setPageState = (setState) => this.setAppState(appState=>({...appState, pageState: setState(appState.pageState)}));
        this.errorSetter = (error) => this.setPageState(state=>({...state, error}))
        this.game = game;
        this.user = user;
        this.render = (appState) => PreGame(appState);
        this.showSettings = false;
    };
};

const PreGame = (appState) => {
    
    const {pageState, token} = appState;
    const {game, user} = pageState;
    const players = game.players || null;
    const civilizations = game.civilizations || [];
    const isHost = game.hostId === user.userId;
    const toggleGameProperty = (propertyName) => {
        const setter = (game) => pageState.setPageState(state=>({...state, game}));
        setServerState(setter, pageState.errorSetter, '/pregame/settings', {token, [propertyName]: !pageState.game[propertyName]}, {...pageState.game, [propertyName]: !pageState.game[propertyName]});
    };

    const changeGameProperty = (propertyName, value) => {
        const setter = (game) => pageState.setPageState(state=>({...state, game}));
        setServerState(setter, pageState.errorSetter, '/pregame/settings', {token, [propertyName]: value}, {...pageState.game, [propertyName]: value});
    };

    const nullState = {           
        name: null,
        pageState: null,
        setState: null,
        error: 0,
        render: ()=><></>,
        user: null,
        game: null,
    };

    const settingsButton  = <Button Icon={GearFill} onClick={()=>pageState.setPageState(state=>({...state, showSettings: !state.showSettings}))}/>;
    const backButton = <Button Icon={ArrowLeftCircleFill} onClick={()=>pageState.setAppState(_=>({...nullState}))}/>;

    // needs a setServerStateAsync
    const handleCivilizationChange = (userId, civilizationId) => console.log(`changing user ${userId} to civlilzation ${civilizationId}`); 
    
    const civilizationFor = (player) => civilizations.filter(civilization=>civilization.civilizationId===player.civilizationId)?.[0];
    const civilizationOption = (civilization, key) => <option disabled={civilization.isTaken} value={civilization.civilizationId} style={{backgroundColor: civilization.color}} key={key}>{title(civilization.name)}</option>
    const civilizationSelect = (player) => <select className="pregameCivilizationSelect" value={player.civilizationId} onChange={(event)=>handleCivilizationChange(player.userId, event.target.value)} style={{backgroundColor: civilizationFor(player).color}}>{civilizations.map(civilizationOption)}</select>
    const civilizationDisplay = (player) => <div className="pregameCivilizationDisplay" style={{backgroundColor: civilizationFor(player).color}}>{title(civilizationFor(player).name)}</div>

    const playerRow = (player, key) => {             
        
        const isUser = player.userId===user.userId;
        const playerIsHost = player.userId===game.hostId;
        const icon = <div className="pregamePlayerIcon">{playerIsHost? <StarFill color="yellow"/>: isUser? <PersonFill color="lightblue"/>: player.type==='human'? <PersonFill color="black"/>: <Robot color="black"/>}</div>;

        return <div key={key} className="pregamePlayerRow">
            {icon}
            <div className="pregamePlayerUsername">{player.username}</div>
            {isHost||isUser? civilizationSelect(player) : civilizationDisplay(player)}
        </div>
    };

    const playersCard =
        <div className="pregamePlayersCardWrapper">
            <div className="pregamePlayersCardText">Players</div>
            <div className="pregamePlayersCard">
                {players? players.map(playerRow): 'loading...'}
            </div>
        </div>

    const gameSettingsCard = 
        <div className="pregameSettingsCardWrapper">
            <div className="pregameSettingsCardText">Settings</div>
            <div className="pregameSettingsCard">
                <div className="pregameSettingRow"><div>Max number of players</div><input className="inpN" type="number" value={game.maxNumberOfPlayers} onChange={(event)=>changeGameProperty('maxNumberOfPlayers', event.target.value)}/></div>
                <div className="pregameSettingRow"><div>Allow AI</div><Button checkable checked={game.allowAI} onClick={()=>toggleGameProperty('allowAI')}/></div>
                <div className="pregameSettingRow"><div>Use advanced AST track</div><Button checkable checked={game.useAdvancedAST} onClick={()=>toggleGameProperty('useAdvancedAST')}/></div>
                <div className="pregameSettingRow">Civilizations</div>
            </div>
            <Button className="pregameStart">Start The Game Already</Button>
        </div>;

    const chatCard = 
        <div className="pregameChatWrapper">
            <div className="pregameChatText">Chat</div>
            {Chat()}
        </div> 


    return <>
        <Header left={backButton} right={settingsButton}>Mega Empires</Header>
        <div className="pregameBody">
            {playersCard}
            {gameSettingsCard}
            {chatCard}
        </div>
        {pageState.showSettings? Settings(pageState): null}
    </>;
};
