import React from "react";
import Board from "../components/Board";
import PlayersCard from "../components/PlayersCard";
import '/frontend/styles/playgame.scss'
import PhasesBanner from "../components/PhasesBanner";

export default class PlayGameState {

    static new = (setAppState, game, user) => ({name: 'playgame', pageState: new PlayGameState(setAppState, game, user)})

    constructor(setAppState, game, user) {
        this.render = (appState) => PlayGame(appState);
        this.setAppState = setAppState;
        this.setPageState = (setState) => this.setAppState(state=>({...state, pageState: {...state.pageState, ...setState(state.pageState)}}));
        this.game = game;
        this.user = user;
        this.phasesHover = false;
        this.playersHover = false;
        this.togglePageState = (propertyName) => this.setPageState(pageState=>({...pageState, [propertyName]: !pageState[propertyName]}));
    };

};

const PlayGame = (appState) => {
    

    const {pageState} = appState;
    const {game, user} = pageState;

    console.log(pageState)
    
    const mapWidth = document.body.clientWidth;
    const mapHeight = document.body.clientHeight;

    return <>
        {Board(mapWidth, mapHeight)}
        <div className="playGameContent">
            
            <div className="column">{PlayersCard()}</div>
            <div className="column">{PhasesBanner([pageState.phasesHover, ()=>pageState.togglePageState('phasesHover')])}</div>
            <div className="column"></div>
            
        </div>
    </>;
};
