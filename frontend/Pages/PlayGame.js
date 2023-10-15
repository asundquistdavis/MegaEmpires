import React, { useMemo } from "react";
import Board from "../components/Board";
import PlayersCard from "../components/PlayersCard";
import '/frontend/styles/playgame.scss'
import PhasesBanner from "../components/PhasesBanner";

export default class PlayGameState {

    static new = (setAppState, game, user) => ({name: 'playgame', pageState: new PlayGameState(setAppState, game, user)})

    constructor(setAppState, game, user) {
        this.name = 'playgame';
        this.render = (appState) => PlayGame(appState);
        this.setAppState = setAppState;
        this.setPageState = (setState) => this.setAppState(state=>({...state, pageState: {...state.pageState, ...setState(state.pageState)}}));
        this.game = game;
        this.user = user;
        this.phasesHover = false;
        this.playersHover = false;
        this.setPhaseHover = (name, value)=>this.setPageState(state=>({...state, phases: [...state.phases.map(phase=>({...phase, hover: (phase.name===name? value: phase.hover)}))]}));
        this.phases = [
            {name: 'census', hover: false, setHover: (value)=>this.setPhaseHover('census', value), actions: ['collect tax', 'resolve city revolts', 'expand population']}, 
            {name: 'movement', hover: false, setHover: (value)=>this.setPhaseHover('movement', value), actions: ['move and support ships and move tokens', 'token conflict', 'city conflict', 'check for city support']}, 
            {name: 'trade', hover: false, setHover: (value)=>this.setPhaseHover('trade', value), actions: ['acquire trade cards', 'trade cards', 'resolve calamities']},
            {name: 'alterations', hover: false, setHover: (value)=>this.setPhaseHover('alterations', value), actions: ['use special abilities', 'purchase advancement cards', 'intermission']}
        ];
        this.playersHover = false;
        this.togglePageState = (propertyName) => this.setPageState(pageState=>({...pageState, [propertyName]: !pageState[propertyName]}));
    };

};

const PlayGame = (appState) => {

    const {pageState} = appState;
    const {game, user} = pageState;
    const players = game.players;

    const player = game.currentPlayerNumber;
    const phase = game.phase||'Loading...';
    const phaseAction = game.phaseAction||null
   
    const mapWidth = document.body.clientWidth;
    const mapHeight = document.body.clientHeight;

    return <>
        {Board(mapWidth, mapHeight)}
        <div className="playGameContent">
            <div className="column">{PlayersCard(player, players, pageState.playersHover, (value)=>{pageState.setPageState(state=>({...state, playersHover: value}))})}</div>
            <div className="column">{PhasesBanner(phase, phaseAction, pageState.phasesHover, (value)=>{pageState.setPageState(state=>({...state, phasesHover: value}))}, pageState.phases)}</div>
            <div className="column"></div>
            
        </div>
    </>;
};
