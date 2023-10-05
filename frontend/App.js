import React, { useEffect, useRef, useState } from "react";
import '/frontend/styles/reset.scss'
import '/frontend/styles/base.scss'
// import Area from "./components/Area";
// import Board from "./components/Board";
import axios from "axios";

// const areaDatas = require('/frontend/assets/map.json');

const App = () => {
    
    const [mapState, setMapState] = useState({
        zoomLevel: 1,
        defaultPosition: {x: 0, y: 0},
        areas: [],
        currentArea: {hexagons: [], name: ''},
    });

    useEffect(()=>{
        axios.post('/test', {payload: 'this is a test post request'})
        .then(console.log)
        .catch(console.log)
    }, [])
    
    const handleAreaAdd = () => {
        setMapState(state=>({...state, areas: state.areas.concat([mapState.currentArea]), currentArea: {name:'', hexagons: []}}))
    };

    return <>
        <div className="testing">
            {/* {Board({areaDatas:areaDatas.areas, mapState, setMapState})} */}
            {/* <div className="submitLine"> */}
                {/* <input value={mapState.currentArea.name} onChange={(event)=>setMapState(state=>({...state, currentArea: {...state.currentArea, name: event.target.value}}))}/> */}
                {/* <button onClick={handleAreaAdd}>Add New Area</button> */}
            {/* </div> */}

        </div>
    </>;
};

export default App;
