import React, { createRef, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Board from "../components/Board";
import PlayersCard from "../components/PlayersCard";
import '/frontend/styles/playgame.scss'
import PhasesBanner from "../components/PhasesBanner";
import Button from "../components/Button";

const mapData = [
    {
        name: 'caledonia'
    },
    {
        name: 'hibernia'
    },
    {
        name: 'britannia'
    },
    {
        name: 'londinium'
    },
    {
        name: 'dyfed'
    },
    {
        name: 'alesia'
    },
    {
        name: 'upper rhine'
    }
]

export default function PlayGame(props) {
    
    const clicking = useRef(false);
    const moving = useRef(false);
    
    const {} = props;
    
    const mapRef = createRef();
    
    const [playState, setPlayState] = useState({
        ready: false,
        game: {
            phase: ''
        }
    });

    
    useEffect(()=>{
        setInterval(()=>{
            const svg = document.querySelector('#boardFrame').contentDocument.getElementById('mapSVG');

            const handleMouseDown = (event) => {
                // console.log('mousedown')
                clicking.current = true
            }

            const handleMouseMove = (event) => {
                clicking.current = false;
                moving.current = true;
            }

            const handleMouseUp = (event) => {
                console.log('mouseup')
                const selected = document.querySelector('[selected]');
                if (clicking.current) {console.log(selected)}
                moving.current = false;
                clicking.current = false;
            }

            svg.addEventListener('pointerdown', handleMouseDown, {capture: true});
            svg.addEventListener('pointermove', handleMouseMove, {capture: true});
            svg.addEventListener('pointerup', handleMouseUp, {capture: true});

            return () => {
                svg.removeEventListener('pointerdown', handleMouseDown);
                svg.removeEventListener('pointermove', handleMouseMove);
                svg.removeEventListener('pointerup', handleMouseUp);
            }
        }, 100);
            
    }, [])

    
    const setExpansionPhase = () => {

        mapData.forEach(area=>{
            const mapArea = doc.querySelector(`[type="cover"][name="${area.name}"]`)||doc.querySelector(`[name="${area.name}"]`);
            mapArea?.setAttribute('owned', '');
        });
    };

        
        const Map = <Board ref={mapRef}/>

    return <>
        {Map}
        <Button className="overBoard" onClick={setExpansionPhase}>click me</Button>
    </>;
};
