import React, { useRef } from "react";
import map from '/frontend/assets/MegaCiv_Mapboard.jpg';
// import '/frontend/styles/mapcreator.scss';
import Button from '/frontend/components/Button';
import { ArrowLeftCircleFill, ArrowRightCircleFill, HexagonFill } from "react-bootstrap-icons";

class Area {

    static new = new Area('', [])
    constructor(name, points) {
        this.name = name;
        this.points = points;
    };
}

export default class MapCreatorState {

    static new = (setAppState, boardHeight) => ({name: 'mapcreator', game: {}, pageState: new MapCreatorState(setAppState, boardHeight)})
    constructor(setAppState, boardHeight) {
        this.renderAreas = true;
        this.mapSettingsIsLeft = false;
        this.renderHexagons = false;
        this.setAppState = setAppState;
        this.maxZoomLevel = 15;
        this.minZoomLevel = 0;
        this.startingZoomLevel = 10;
        this.scaleFactor = 150;
        this.zoomLevel = this.startingZoomLevel;
        this.top = 0;
        this.aspectRatio = 656/227;
        this.left = 0;
        this.dragging = false;
        this.touchingX = 0;
        this.touchingY = 0;
        this.hexagonSpacing = 20;
        this.currentArea = Area.new;
        this.areas = [];
        this.mapName = '';
        this.points = Array.from(Array(Math.floor(3000/this.hexagonSpacing))).map((_, nx)=>Array.from(Array(Math.floor(3000/this.hexagonSpacing))).map((_, ny)=>({nx, ny, isUsed: false, isHovered: false, isSelected: false}))).flat(1);
        this.render =  (appState) => MapCreator(appState);
        this.setPageState = (setState) => this.setAppState(appState=>({...appState, pageState: {...setState(appState.pageState)}}));
    };
};

const MapCreator = (appState) => {

    const {pageState} = appState;
    const {zoomLevel, top, left, scaleFactor, aspectRatio, maxZoomLevel, minZoomLevel, startingZoomLevel, hexagonSpacing, currentArea} = pageState;
    const {name, } = currentArea;
    const boardHeight = appState.baseHeight;
    const boardWidth = appState.baseWidth;
    const height = boardHeight + scaleFactor * zoomLevel;
    const width = height * aspectRatio;
    const yScale = (boardHeight + scaleFactor * zoomLevel)/(boardHeight + scaleFactor * startingZoomLevel);
    const xScale = yScale;
    const yStep = hexagonSpacing/2*yScale;
    const xStep = Math.sqrt(3)*hexagonSpacing/2*xScale;

    const handleMouse = (value) => {
        pageState.setPageState(state=>({...state, dragging: value}))
    }

    const handleMouseMove = (event) => {
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
            const touchingX = event.touches[0].pageX;
            const touchingY = event.touches[0].pageY;
            pageState.setPageState(state=>({...state, touchingX, touchingY}));
        }
    };

    const handleTouchEnd = (event) => {
        pageState.setPageState(state=>({...state, touchingX: 0, touchingY: 0}))
    }; 

    const handleTouchMove = (event) => {
        if (event.touches.length === 1) {    
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
        const direction = event.deltaY > 0? -1: 1;
        const zoomLevel = pageState.zoomLevel + direction;
        const inBounds = (minZoomLevel<=zoomLevel) && (zoomLevel<=maxZoomLevel);
        const leftCorrection = Math.floor(direction*scaleFactor*aspectRatio*left/(boardWidth-width));
        const topCorrection = Math.floor(direction*scaleFactor*top/(boardHeight-height));
        if (inBounds) {pageState.setPageState(state=>({...state, zoomLevel, left: state.left-leftCorrection, top: state.top-topCorrection}))};
    };

    const hexagon = (nx, ny, key) => {

        const yStart = 3/2*ny*yStep;
        const xStart = 2*nx*xStep - ny%2*xStep;

        if (isUsed||xStart<-5*hexagonSpacing||boardWidth+hexagonSpacing-left<xStart||yStart<-hexagonSpacing||boardHeight+hexagonSpacing-top<yStart) {return}
        else {

            const handleMouseEnter = () => {pageState.setPageState(state=>({...state, points: state.points.map(point=>point.nx===nx&&point.ny===ny? {...point, isHovered: true}: point)}))};
            const handleMouseLeave = () => {pageState.setPageState(state=>({...state, points: state.points.map(point=>point.nx===nx&&point.ny===ny? {...point, isHovered: false}: point)}))};
            const handleClick = (event) => {
                console.log(event)
                pageState.setPageState(state=>({
                    ...state, 
                    points: state.points.map(point=>point.nx===nx&&point.ny===ny? {...point, isSelected: !point.isSelected}: point),
                    currentArea: {...state.currentArea, points: state.currentArea.points.concat([{nx, ny}])}
                }))
            }

            return <svg key={key} nx={nx} ny={ny}>
                <path 
                d={`M${xStart} ${yStart} v${yStep} l${xStep} ${yStep/2} l${xStep} ${-yStep/2} v${-yStep} l${-xStep} ${-yStep/2} z`} 
                fill={isSelected? 'darkgreen': isHovered? 'green': 'blue'} 
                fillOpacity={.3} 
                stroke="black" 
                mask="url(#mask)"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                onClick={handleClick}/>
            </svg>
        }
    };

    const handleAreaCreate = ()=>{
        pageState.currentArea.points.forEach(currentPoint => {
            pageState.setPageState(state=>({...state, points: state.points.map(point=>((point.nx===currentPoint.nx)&&(point.ny===currentPoint.ny))? {...point, isSelected: false, isUsed: true}: point)}));
        });
        pageState.setPageState(state=>({...state, areas: state.areas.concat([currentArea]), currentArea: Area.new}))
    };

    const handleSaveAreas = () => {
        const link = document.createElement('a');
        const file = new Blob([JSON.stringify(pageState.areas)], {type: 'text/JSON'});
        link.href = URL.createObjectURL(file);
        link.download = pageState.mapName + '.json';
        link.click();
        URL.revokeObjectURL(link.href)
    };

    const handleLoadAreas = () => {
        const file = document.getElementById('mapFile').files[0];
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            const areas = JSON.parse(event.target.result);
            console.log(file.name, areas)
        }
        reader.readAsText(file);
    };

    const renderArea = (area, key, pageState) => {
        console.log(area.points)
        return <svg key={key} area={area.name}>
            {area.points.map(({nx, ny}, key)=>hexagon(nx, ny, key))}
        </svg>
    };

    const generateFakeAreas = () => {
        const areas = Array.from(Array(500)).map((_, nx)=>({points: [Array.from(Array(20)).map((_, ny)=>({nx, ny}))], name: nx}))
        pageState.setPageState(state=>({...state, areas}))
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
                        {/* {pageState.renderHexagons? pageState.points.map(({nx, ny, isUsed, isHovered, isSelected}, key)=>hexagon(nx, ny, isUsed, isHovered, isSelected, key)): null} */}
                        {pageState.renderAreas? pageState.areas.map((area, key)=>renderArea(area, key, pageState)): null}
                    </svg>
            </div>
        </div>
        <div className={`mapCreatorAreas ${pageState.mapSettingsIsLeft? 'mapCreatorLeft': ''}`}>
            <div className="mapCreatorTitleRow">
                <Button Icon={pageState.mapSettingsIsLeft? ArrowRightCircleFill :ArrowLeftCircleFill} width={20} height={20} onClick={()=>pageState.setPageState(state=>({...state, mapSettingsIsLeft: !state.mapSettingsIsLeft}))}/>
                <div className="mapCreatorTitleText">Current Area</div>
            </div>
            <div className="mapCreatorCurrentRow">
                <div className="mapCreatorCurrently">Number of Areas:</div>
                <div className="mapCreatorCurrentCount">{pageState.areas.length}</div>
            </div>
            <div className="mapCreatorNameRow">
                <div className="mapCreatorName">Map Name:</div>
                <input className="mapCreatorNameInput" placeholder="Area Name" value={pageState.mapName} onChange={(event)=>pageState.setPageState(state=>({...state, mapName: event.target.value}))}/>
            </div>
            <div className="mapCreatorChooseMapRow">
                <input type='file' id="mapFile" className="mapCreatorSubmitButton"/>
            </div>
            <div className="mapCreatorSubmitRow">
                <Button className="mapCreatorSubmitButton" onClick={handleLoadAreas}>Load Map</Button>
                <Button className="mapCreatorSubmitButton" onClick={handleSaveAreas}>Save Map</Button>
            </div>
        </div>
        <div className="mapCreatorCurrent">
            <div className="mapCreatorTitleRow">
                <div className="mapCreatorTitleText">Current Area</div>
                <Button Icon={HexagonFill} width={20} height={20} onClick={()=>pageState.setPageState(state=>({...state, renderHexagons: !state.renderHexagons}))}/>
            </div>
            <div className="mapCreatorNameRow">
                <div className="mapCreatorName">Name:</div>
                <input className="mapCreatorNameInput" placeholder="Area Name" value={name} onChange={(event)=>pageState.setPageState(state=>({...state, currentArea: {...state.currentArea, name: event.target.value}}))}/>
            </div>
            <div className="mapCreatorNameRow">
                <div className="mapCreatorName">Support:</div>
                <input className="mapCreatorNameInput" placeholder="Area Name" value={name} onChange={(event)=>pageState.setPageState(state=>({...state, currentArea: {...state.currentArea, name: event.target.value}}))}/>
            </div>
            <div className="mapCreatorSubmitRow">
                <Button className="mapCreatorSubmitButton" onClick={generateFakeAreas}>Create Area</Button>
            </div>
        </div>
    </>;
};