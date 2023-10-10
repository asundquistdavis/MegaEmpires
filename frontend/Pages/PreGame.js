import React, { useEffect, useState } from "react";
import '/frontend/styles/pregame.scss'
import Header from "../components/Header";
import Button from "../components/Button";
import { GearFill, PersonFill, Robot, StarFill } from "react-bootstrap-icons";
import Settings from "../components/Settings";
import { title } from "../utilities";

export default class PreGameState {

    static new = (setter, game, user) => ({name:'pregame', pageState: new PreGameState(setter, game, user)});

    constructor(setAppState, game, user) {
        this.setAppState = setAppState;
        this.setPageState = (setState) => this.setAppState(appState=>({...appState, pageState: setState(appState.pageState)}));
        this.game = game;
        this.user = user;
        this.render = (appState) => PreGame(appState);
        this.showSettings = false;
    };
};

const PreGame = (appState) => {

    const {pageState} = appState;
    const {game, user} = pageState;
    const players = game.players || [];
    const civilizations = game.civilizations || [];
    const isHost = game.hostId === user.userId;

    const settingsButton  = <Button Icon={GearFill} onClick={()=>pageState.setPageState(state=>({...state, showSettings: !state.showSettings}))}/>

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

    const playersCard = <div className="pregamePlayersCard">
        {players.map(playerRow)}
    </div>

    return <>
        <Header right={settingsButton}>Mega Empires</Header>
        <div className="pregameBody">
            {playersCard}
            {playersCard}
        </div>
        {pageState.showSettings? Settings(pageState): null}
    </>;
};
