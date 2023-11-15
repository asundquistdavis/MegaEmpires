import React, { useRef, forwardRef, useState, createRef, useMemo, useCallback } from "react";
import '/frontend/styles/mapeditor.scss';
import mapFile from '/frontend/assets/MegaCiv_Mapboard.jpg';
import Header from "../components/Header";
import Button from "../components/Button";
import { ArrowDownSquareFill, ArrowUpSquareFill } from "react-bootstrap-icons";
import GameEditor from "./GameEditor";

export default function MapEditor(props) {

    let areaId = 0;

    const { appState, setAppState } = props;

    class _Point {
        constructor(elem) {
            this.nx = elem.attributes.nx.value;
            this.ny = elem.attributes.ny.value;
            this.elem = elem;
        };
    };

    class _Area {

        constructor() {
            this.name = '';
            this.points = [];
            this.openSeaPoints = [];
            this.coastalPoints = [];
            this.cityPoint = null;
            this.floodPlainPoints = [];
            this.volcanoPoint = null;
            this.floodPlainCityPoint = null;
            this.support = 0;
            this.waterPoints = [];
            this.id = areaId;
            areaId += 1;
            console.log(this);
        };
    };

    const [editorState, setEditorState] = useState({
        areas: [],
        currentArea: new _Area(),
        down: false,
        showCurrent: false,
        showMapAreas: false,
        mapName: '',
        numberOfNodes: 15200,
    });

    // 208 * 71 ~= 15000 and 208 * 7px = 1600px
    // 52 * 17 ~= 884 and 52 * 28px = 1456px
    const resolution = 12;
    const Nx = Math.ceil(1600/resolution*2*Math.sqrt(3)/3);
    const Ny = Math.ceil(552/resolution/3*4);
    const maxScale = 10;
    const minScale = 1;
    const mapRef = createRef();
    const mapValues = useRef({
        scale:3,
        mx:0, 
        my:0, 
        moving: false, 
        hovered: null, 
        selected: null,
    });
    function changeElement(elem, attr, value) {
        elem.attributes[attr].value = value;
    };
    const moveInBounds = () => {
        mapRef.current.scrollIntoView({block: 'nearest', inline:'nearest'});
    };
    const handleMouseDown = useCallback((event)=>{
        mapValues.current.clicking = true;
        mapValues.current.moving = true;
    }, [mapRef]);
    const handleMouseMoveMap = useCallback((event)=>{
        mapValues.current.clicking = false;
        if (mapValues.current.moving) {
            mapValues.current.mx += event.movementX;
            mapValues.current.my += event.movementY;
            changeElement(mapRef.current,'transform', `translate(${mapValues.current.mx} ${mapValues.current.my}) scale(${mapValues.current.scale} ${mapValues.current.scale})`);
            moveInBounds();
        };
    }, [mapRef]);
    const handleMouseUpMap = () => {
        mapValues.current.moving = false
    };
    const handleMouseUpHex = useCallback((event)=>{
        const target = event.target;
        const isUsed = target.attributes.isused.value === 'true';
        if (mapValues.current.clicking && !isUsed) {
            const alt = event.altKey;
            const shift = event.shiftKey;
            const ctrl = event.ctrlKey;
            const isSelected = target.attributes.isselected.value === 'true';
            if (isSelected) { // deselect - blue
                setEditorState(state=>({...state, currentArea: {
                    ...state.currentArea,
                    points: state.currentArea.points.filter(point=>point.elem!==target),
                    cityPoint: (state.currentArea.cityPoint?.elem===target? null:  state.currentArea.cityPoint),
                    floodPlainCityPoint: (state.currentArea.floodPlainCityPoint?.elem===target? null:  state.currentArea.floodPlainCityPoint),
                    floodPlainPoints: state.currentArea.floodPlainPoints.filter(point=>point.elem!==target),
                    volcanoPoint: (state.currentArea.volcanoPoint?.elem===target? null:  state.currentArea.volcanoPoint),
                    coastalPoints: state.currentArea.coastalPoints.filter(point=>point.elem!==target),
                    openSeaPoints: state.currentArea.openSeaPoints.filter(point=>point.elem!==target),
                }}));
                changeElement(target, 'fill', 'blue');
                changeElement(target, 'opacity', .3);
            } else {
                changeElement(target, 'opacity', 1);
                if (ctrl && shift && alt) { // not implemented/reserved
                } else if (ctrl && shift && !alt) { // open sea - dark blue 
                    setEditorState(state=>({...state, currentArea: {...state.currentArea, openSeaPoints: [...state.currentArea.openSeaPoints, new _Point(target)]}}))
                    changeElement(target, 'fill', 'darkblue');
                } else if (ctrl && !shift && alt) { // flood plain city - white
                    setEditorState(state=>({...state, currentArea: {...state.currentArea, floodPlainCityPoint: new _Point(target)}}))
                    changeElement(target, 'fill', !isSelected? 'white': 'blue');
                } else if (ctrl && !shift && !alt) { // plain city - black
                    setEditorState(state=>({...state, currentArea: {...state.currentArea, cityPoint: new _Point(target)}}))
                    changeElement(target, 'fill', 'black');
                } else if (!ctrl && shift && alt) { // volcano - red
                    setEditorState(state=>({...state, currentArea: {...state.currentArea, volcanoPoint: new _Point(target)}}))
                    changeElement(target, 'fill', 'red')
                } else if (!ctrl && shift && !alt) { // coastal - light blue
                    setEditorState(state=>({...state, currentArea: {...state.currentArea, coastalPoints: [...state.currentArea.coastalPoints, new _Point(target)]}}))
                    changeElement(target, 'fill', 'lightblue')
                } else if (!ctrl && !shift && alt) { // flood plain - dark green
                    setEditorState(state=>({...state, currentArea: {...state.currentArea, floodPlainPoints: [...state.currentArea.floodPlainPoints, new _Point(target)]}}))
                    changeElement(target, 'fill', 'darkgreen');
                } else { // default/none - yellow
                    changeElement(target, 'fill', 'yellow');
                };
                setEditorState(state=>({...state, currentArea: {...state.currentArea, points: [...state.currentArea.points, new _Point(target)]}}))
            };
            changeElement(target, 'isselected', !isSelected);
            
        };
    }, [mapRef]);

    const handleMouseEnterHex = useCallback((event) => {
        const hovered = event.target;
        const isSelected = hovered.attributes.isselected.value === 'true';
        const isUsed = hovered.attributes.isused.value === 'true';
        if (!isSelected&&!isUsed) {
            mapValues.current.hovered = hovered;
            changeElement(hovered, 'fill', 'green');
        };
    }, [mapRef]);
    const handleMouseLeaveHex = useCallback((event) => {
        const hovered = mapValues.current.hovered;
        const isSelected = hovered? hovered.attributes.isselected.value==='true': false;
        const isUsed = hovered? hovered.attributes.isused.value === 'true': false;
        if (hovered && !isSelected && !isUsed) {changeElement(hovered, 'fill', 'blue')};
    }, [mapRef]);
    const handleMouseLeaveMap = () => {
        mapValues.current.moving = false;
    };
    const handleWheel = useCallback((event)=>{
        const scrollDirection = event.deltaY<0? 1: -1;
        const targetScale = mapValues.current.scale + scrollDirection;
        if (targetScale<maxScale&&targetScale>=minScale) {
            mapValues.current.mx += (targetScale/mapValues.current.scale-1)*mapValues.current.mx;
            mapValues.current.my += (targetScale/mapValues.current.scale-1)*mapValues.current.my;
            mapValues.current.scale = targetScale;
            const transform = `translate(${mapValues.current.mx} ${mapValues.current.my}) scale(${mapValues.current.scale} ${mapValues.current.scale})`;
            changeElement(mapRef.current, 'transform', transform);
            moveInBounds();
        };
    }, [mapRef]);

    const Hexagon = function(props) {
        const _nx = props.nx||0;
        const _ny = props.ny||0;
        const _scale = props.scale;
        const _height = _scale||40;
        const _width = _scale||40;
        const _yStep = _height/4;
        const _xStep = Math.sqrt(3)*_width/4;
        const _xOff = _width-2*_xStep;
        const _x = 2*_xStep * _nx - (_ny%2? _xStep: 0);
        const _y = 3*_yStep * _ny - _yStep;
        return <path 
        nx ={_nx}
        ny={_ny}
        d={`M${_x+_xOff} ${_y+_yStep} l${_xStep} ${-_yStep} l${_xStep} ${_yStep} v${2*_yStep} l${-_xStep} ${_yStep} l${-_xStep} ${-_yStep} z`} 
        fill="blue"
        stroke="black"
        strokeWidth={.5}
        onMouseDown={handleMouseDown}
        onMouseEnter={(event)=>handleMouseEnterHex(event)}
        onMouseLeave={(event)=>handleMouseLeaveHex(event)}
        onMouseUp={(event)=>handleMouseUpHex(event)}
        isselected="false"
        isused="false"
        opacity={.3}
        />
    };

    const  map = useMemo(()=>{
        const scale = mapValues.current.scale;
        const points = Array.from(Array(Nx)).map((_, nx)=>Array.from(Array(Ny)).map((_, ny)=>[nx, ny])).flat(1)
        const hexagons = points.map(([nx, ny], key)=><Hexagon key={key} nx={nx} ny={ny} scale={resolution}/>);
        return <svg
        ref={mapRef}
        tabIndex={0}
        style={{backgroundImage: `url(${mapFile})`, backgroundSize: 'cover', backgroundPositionX: 0, backgroundPositionY: 0}}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveMap}
        onMouseUp={handleMouseUpMap}
        onMouseMove={handleMouseMoveMap}
        onWheel={handleWheel}
        width={1600}
        height={552}
        transform={`scale(1 1) translate(0 0)`}
        >{hexagons}
        </svg>
    }, []);



    function Overlay() {
        
        function TextEntry(props) {
            const { label, stateName, sub, number } = props;
            const stateValue = sub? editorState[sub][stateName]: editorState[stateName];
            const id = stateName+'Input';
            const setter = (event) => sub? setEditorState(state=>({...state, [sub]: {...state[sub], [stateName]: event.target.value}})): setEditorState(state=>({...state, [stateName]: event.target.value}));
            return <div className="textEntryRow">
                <label 
                htmlFor={id}
                className="textEntryLabel"
                >{label}</label>
                <input 
                id={id}
                className="textEntryInput"
                min={0}
                type={number? 'number': 'text'}
                placeholder={label}
                value={stateValue}
                onChange={setter}/>
            </div>
        };

        function DisplayValue(props) {
            const {label, value} = props;
            return <div className="textEntryRow">
                <div>{label}</div>
                <div>{value}</div>
            </div>
        };

        function SelectType(props) {
            const {label, stateName, optionLabelValues, sub} = props;
            const stateValue = sub? editorState[sub][stateName]: editorState[stateName];
            const setter = (event) => sub? setEditorState(state=>({...state, [sub]: {...state[sub], [stateName]: event.target.value}})): setEditorState(state=>({...state, [stateName]: event.target.value}));
            const options = optionLabelValues.map((option,key)=><option key={key} value={option.value}>{option.label}</option>)
            return <div className="textEntryRow">
                <div>{label}</div>
                <select className="selectType" value={stateValue} onChange={setter}>{options}</select>
            </div>
        };

        const handleAreaAdd = () => {
            editorState.currentArea.points.forEach(point=>{
                changeElement(point.elem, 'opacity', '.5');
                changeElement(point.elem, 'isselected', 'false')
                changeElement(point.elem, 'isused', 'true')
            });
            setEditorState(state=>({...state, areas: [...state.areas, state.currentArea], currentArea: new _Area()}));
        };
        const handleAreaReset = () => {
            editorState.currentArea.points.forEach(point=>{changeElement(point.elem, 'fill', 'blue'); changeElement(point.elem, 'isselected', 'false'); changeElement(point.elem, 'opacity', .3)});
            setEditorState(state=>({...state, currentArea: new _Area()}))
        };

        const handleUndo = () => {
            editorState.areas?.[editorState.areas.length-1]?.points?.forEach(point=>{changeElement(point.elem, 'fill', 'blue'); changeElement(point.elem, 'isused', 'false'); changeElement(point.elem, 'opacity', .3)});
            setEditorState(state=>({...state, areas: state.areas.slice(0, -1)}))
        };

        const handleCreateMap = () => {
            setAppState(state=>({...state, name: 'gameEditor', App: GameEditor, mapAreas: editorState.areas, mapMeta: {resolution, Nx, Ny}}))
        };

        return <div className={"overlay  " + (editorState.down? 'down ': '')}>
            <div 
            className={'currentArea overboard '} 
            onMouseEnter={()=>setEditorState(state=>{return({...state, showCurrent: true})})} 
            onMouseLeave={()=>setEditorState(state=>({...state, showCurrent: false}))}>
                <Header>Current Area</Header>
                {editorState.showCurrent? 
                <div className="currentAreaContent">
                    {TextEntry({label:'Area Name', stateName: 'name', sub: 'currentArea'})}
                    {TextEntry({label:'Support', stateName: 'support', sub: 'currentArea', number: true})}
                    <DisplayValue label='Type' value={(editorState.currentArea.openSeaPoints.length? 'Open Sea': editorState.currentArea.coastalPoints.length? 'Coastal': 'Land')}/>
                    <DisplayValue label='Has City Cite' value={(editorState.currentArea.cityPoint||editorState.currentArea.floodPlainCityPoint)? 'Yes': 'No'}/>
                    <DisplayValue label='Number of Hexagons' value={editorState.currentArea.points.length}/>
                    <DisplayValue label='Has Flood Plain' value={(editorState.currentArea.floodPlainPoints.length||editorState.currentArea.floodPlainCityPoint)? 'Yes': 'No'}/>
                    <DisplayValue label='Has Volcano' value={editorState.currentArea.volcanoPoint? 'Yes': 'No'}/>
                    <DisplayValue label='City is on Flood Plain' value={editorState.currentArea.floodPlainCityPoint? 'Yes': 'No'}/>
                    <div className="currentButtonsRow">
                        <Button onClick={handleAreaAdd}>Add Area</Button>
                        <Button onClick={handleAreaReset}>Reset Area</Button>
                        <Button onClick={handleUndo}>Undo Area</Button>
                    </div>
                </div>: null}
            </div>
            <div
            className="mapAreas overboard"  
            onMouseEnter={()=>setEditorState(state=>({...state, showMapAreas: true}))} 
            onMouseLeave={()=>setEditorState(state=>({...state, showMapAreas: false}))}>
                <Header>Map</Header>
                {editorState.showMapAreas? 
                <div>
                    {TextEntry({label: 'Map Name', stateName: 'mapName'})}
                    <DisplayValue label='Total Number of Hexagons' value={Nx*Ny}/>
                    <DisplayValue label='Hexagon Resolution' value={resolution}/>
                    <DisplayValue label='Number Map Areas' value={editorState.areas.length}/>
                    <Button onClick={handleCreateMap}>Submit</Button>
                </div>: null}
            </div>
        </div>
    };
    return <>
        <div className="board">
        {map}
        </div>
        {Overlay()}
    </>

};