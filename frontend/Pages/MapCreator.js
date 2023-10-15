import React from "react";
import map from '/frontend/assets/MegaCiv_Mapboard.jpg';
import '/frontend/styles/mapcreator.scss';
import Hexagon from "../components/Hexagon";

export default class MapCreatorState {

    static new = (setAppState) => ({name: 'mapcreator', game: {}, pageState: new MapCreatorState(setAppState)})
    constructor(setAppState) {
        this.setAppState = setAppState;
        this.maxZoomLevel = 15;
        this.scaleFactor = 150;
        this.zoomLevel = 0;
        this.top = 0;
        this.aspectRatio = 656/227;
        this.left = 0;
        this.dragging = false;
        this.touchingX = 0;
        this.touchingY = 0;
        this.hexagonSpacing = 50;
        this.render = (appState) => MapCreator(appState)
        this.setPageState = (setState) => this.setAppState(appState=>({...appState, pageState: {...setState(appState.pageState)}}));
    };
}

const MapCreator = (appState) => {
    
    const {pageState} = appState;
    const {zoomLevel, top, left, scaleFactor, aspectRatio, maxZoomLevel, hexagonSpacing} = pageState;
    const height = document.getElementsByClassName('baseBody')[0].offsetHeight + scaleFactor * zoomLevel;
    const width = height * aspectRatio 
    
    const handleMouse = (value) => {
        pageState.setPageState(state=>({...state, dragging: value}))
    }


    const handleMouseMove = (event) => {
        const boardWidth = document.body.getElementsByClassName('baseBody')[0].offsetWidth-10;    
        const boardHeight = document.body.getElementsByClassName('baseBody')[0].offsetHeight-10;
        const left = pageState.left + event.movementX;
        const top = pageState.top + event.movementY;
        const inXBounds = (left>boardWidth-width)&&(0>left);
        const inYBounds = (top>boardHeight-height)&&(0>top);
        if (pageState.dragging) {pageState.setPageState(state=>({...state, top: inYBounds? top: state.top, left: inXBounds? left:state.left}))};
    };

    const handleMouseLeave = (event) => {
        if (pageState.dragging) {pageState.setPageState(state=>({...state, dragging: false}))}
    }

    const handleTouchStart = (event) => {
        if (event.touches.length === 1) {
            const touchingX = event.touches[0].pageX
            const touchingY = event.touches[0].pageY
            pageState.setPageState(state=>({...state, touchingX, touchingY}));
        }
    };

    const handleTouchEnd = (event) => {
        pageState.setPageState(state=>({...state, touchingX: 0, touchingY: 0}))
    }; 

    const handleTouchMove = (event) => {
        if (event.touches.length === 1) {    
            const boardWidth = document.body.getElementsByClassName('baseBody')[0].offsetWidth-10;    
            const boardHeight = document.body.getElementsByClassName('baseBody')[0].offsetHeight-10;
            const touchingX = event.touches[0].pageX
            const touchingY = event.touches[0].pageY
            const left = pageState.left + (touchingX - pageState.touchingX);
            const top = pageState.top + (touchingY - pageState.touchingY);
            const inXBounds = (left>boardWidth-width)&&(0>left);
            const inYBounds = (top>boardHeight-height)&&(0>top);
            pageState.setPageState(state=>({...state, left: inXBounds? left: state.left, top: inYBounds? top: state.top, touchingX, touchingY}));
        };
    };

    const handleZoom = (event) => {            
        const boardWidth = document.body.getElementsByClassName('baseBody')[0].offsetWidth-10;    
        const boardHeight = document.body.getElementsByClassName('baseBody')[0].offsetHeight-10;
        const direction = event.deltaY > 0? -1: 1;
        const zoomLevel = pageState.zoomLevel + direction;
        const inBounds = (0<=zoomLevel) && (zoomLevel<=maxZoomLevel);
        const leftCorrection = Math.floor(direction*scaleFactor*aspectRatio*left/(boardWidth-width));
        const topCorrection = Math.floor(direction*scaleFactor*top/(boardHeight-height));
        if (inBounds) {pageState.setPageState(state=>({...state, zoomLevel, left: state.left-leftCorrection, top: state.top-topCorrection}))}
    };

    const points = Array.from(Array(50)).map((_, nx)=>Array.from(Array(50)).map((_, ny)=>[nx, ny])).flat(1);

    const hexagon = (nx, ny, key, hexagonSpacing) => {

        const yScale = (document.getElementsByClassName('baseBody')[0].offsetHeight + scaleFactor * zoomLevel)/document.getElementsByClassName('baseBody')[0].offsetHeight;
        const xScale = yScale;
        const yStep = hexagonSpacing/2 * yScale;
        const xStep = Math.sqrt(3)*hexagonSpacing/2 * xScale;
        const yStart = top + 3/2*ny*yStep;
        const xStart = left + 2*nx*xStep - ny%2*xStep;

        return <svg key={key}>
            <path d={`M${xStart} ${yStart} v${yStep} l${xStep} ${yStep/2} l${xStep} ${-yStep/2} v${-yStep} l${-xStep} ${-yStep/2} z`} fill="blue" fillOpacity={.3} stroke="black"></path>
        </svg>
    };
    
    return <>
        <div className="mapCreatorBorder">
            <div className="mapCreatorMap" 
            onMouseDown={()=>handleMouse(true)}
            onMouseUp={()=>handleMouse(false)} 
            onMouseMove={handleMouseMove} 
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={(handleTouchMove)}
            onWheel={handleZoom}
            style={{
                backgroundImage: `url(${map})`, 
                backgroundRepeat: 'no-repeat', 
                left,
                top,
                width, 
                height, 
                backgroundSize: 'cover'
                }}>
                    <svg width={width} height={height}>
                        {points.map(([nx, ny], key)=>hexagon(nx, ny, key, hexagonSpacing))}
                    </svg>
            </div>
        </div>
    </>;
};
