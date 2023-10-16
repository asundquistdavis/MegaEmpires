import React from "react";
import map from '/frontend/assets/MegaCiv_Mapboard.jpg';
import '/frontend/styles/mapcreator.scss';
import Hexagon from "../components/Hexagon";

export default class MapCreatorState {

    static new = (setAppState, boardHeight) => ({name: 'mapcreator', game: {}, pageState: new MapCreatorState(setAppState, boardHeight)})
    constructor(setAppState, boardHeight) {
        this.setAppState = setAppState;
        this.maxZoomLevel = 15;
        this.scaleFactor = 150;
        this.zoomLevel = 10;
        this.top = 0;
        this.aspectRatio = 656/227;
        this.left = 0;
        this.dragging = false;
        this.touchingX = 0;
        this.touchingY = 0;
        this.hexagonSpacing = 10;
        this.points = Array.from(Array(Math.floor(1000*this.aspectRatio/this.hexagonSpacing))).map((_, nx)=>Array.from(Array(Math.floor(1000/this.hexagonSpacing))).map((_, ny)=>({nx, ny, isUsed: false, isHovered: false, isSelected: false}))).flat(1);
        this.render = (appState) => MapCreator(appState);
        this.setPageState = (setState) => this.setAppState(appState=>({...appState, pageState: {...setState(appState.pageState)}}));
    };
}

const MapCreator = (appState) => {

    const {pageState} = appState;
    const {zoomLevel, top, left, scaleFactor, aspectRatio, maxZoomLevel, hexagonSpacing} = pageState;
    const boardHeight = appState.baseHeight;
    const boardWidth = appState.baseWidth;
    const height = boardWidth + scaleFactor * zoomLevel;
    const width = height * aspectRatio;
    const yScale = (boardHeight + scaleFactor * zoomLevel)/boardHeight;
    const xScale = yScale;
    const yStep = hexagonSpacing/2*yScale;
    const xStep = Math.sqrt(3)*hexagonSpacing/2*xScale;
    
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

    const hexagon = (nx, ny, isUsed, isHovered, isSelected, key) => {

        const yStart = 3/2*ny*yStep;
        const xStart = 2*nx*xStep - ny%2*xStep;

        if (xStart<-5*hexagonSpacing||boardWidth+hexagonSpacing-left<xStart||yStart<-hexagonSpacing||boardHeight+hexagonSpacing-top<yStart) {return null}
        else {

            const handleMouseEnter = () => {pageState.setPageState(state=>({...state, points: state.points.map(point=>point.nx===nx&&point.ny===ny? {...point, isHovered: true}: point)}))};
            const handleMouseLeave = () => {pageState.setPageState(state=>({...state, points: state.points.map(point=>point.nx===nx&&point.ny===ny? {...point, isHovered: false}: point)}))};
            const handleClick = () => {{pageState.setPageState(state=>({...state, points: state.points.map(point=>point.nx===nx&&point.ny===ny? {...point, isSelected: !point.isSelected}: point)}))}}

            return <svg key={key} nx={nx} ny={ny}>
                <path 
                d={`M${xStart} ${yStart} v${yStep} l${xStep} ${yStep/2} l${xStep} ${-yStep/2} v${-yStep} l${-xStep} ${-yStep/2} z`} 
                fill={isUsed? 'red': isSelected? 'darkgreen': isHovered? 'red': 'blue'} 
                fillOpacity={.3} 
                stroke="black" 
                mask="url(#mask)"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}/>
            </svg>
        }
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
                    <svg width={width} height={height} left={left} top={top}>
                        {pageState.points.map(({nx, ny, isUsed, isHovered, isSelected}, key)=>hexagon(nx, ny, isUsed, isHovered, isSelected, key))}
                    </svg>
            </div>
        </div>
        <div className="mapCreatorInputs">
            <div className="mapCreatorTitleRow">Map Creator</div>
            <div className="mapCreatorCurrentRow">
                <div className="mapCreatorCurrent">Currently Selected:</div>
                <div className="mapCreatorCurrentCount">{pageState.points.length}</div>
            </div>
            <div className="mapCreatorNameRow">
                <div className="mapCreatorName">Name:</div>
                <input className="mapCreatorNameInput"/>
            </div>
        </div>
    </>;
};
