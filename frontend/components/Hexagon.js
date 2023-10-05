import React from "react";

const Hexagon = (props) => {
    
    const { hexData, key, scale, mapState, setMapState } = props;
    
    const { nx, ny, l } = hexData;

    const sx = Math.sqrt(3)/2*l*scale;
    const sy = 3/4*l*scale;
    const cx = sx*nx + .5*sx*(ny%2);
    const cy = sy*ny;
    const center = `${cx} ${cy}`
    const dx = sx/2;
    const dy = sy/3;

    
    const highlightStyle = (event) => {
        const hexagon = event.target;
        hexagon.attributes['fill'].value = 'red';
        hexagon.attributes['stroke-width'].value = '1px'
    }

    const resetStyle = (event) => {
        const hexagon = event.target;
        hexagon.attributes['fill'].value = 'blue';
        hexagon.attributes['stroke-width'].value = '1px'
    }

    const onClick = (event) => {
        const hexagon = event.target;
        const nx = hexagon.attributes.nx.value;
        const ny = hexagon.attributes.ny.value;
        setMapState(state=>({...state, currentArea: {...state.current, hexagons: state.currentArea.hexagons.concat([{nx, ny}])}}))
    }
 
    const svg = 
        <svg key={key}>
            <path
            nx={nx}
            ny={ny}
            d={`M${center} m${-dx} ${-dy} v${2*dy} l${dx} ${dy} l${dx} ${-dy} v${-2*dy} l${-dx} ${-dy} z`}
            onClick={onClick}
            onMouseOver={highlightStyle} 
            onMouseOut={resetStyle}
            fillOpacity={.25}
            fill='blue' 
            stroke="black"
            strokeWidth='1px'/>
        </svg>
    return svg
};

export default Hexagon;