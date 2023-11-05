import React, { createRef, useEffect, useMemo, useState } from "react";
import Board from "../components/Board";
import PlayersCard from "../components/PlayersCard";
import '/frontend/styles/playgame.scss'
import PhasesBanner from "../components/PhasesBanner";
import Button from "../components/Button";

export default function PlayGame(props) {

    const {appState, setAppState} = props;

    const mapRef = createRef();

    const [playState, setPlayState] = useState({
        game: {
            phase: ''
        }
    });

    useEffect(()=>{
        if (playState.game.phase==='movement') {
            console.log(mapRef.current)
        }
    }, [playState]);



    const handleClick = () => {
        const doc = mapRef.current.contentDocument
        const texts = Array.from(doc.getElementsByTagName('text'));
        
        texts.forEach(text=>{
            text.style.display = 'none';
        });
    };

    return <>
        <Board ref={mapRef}/>
        <Button className="overBoard" onClick={handleClick}>click me</Button>
    </>;
};
