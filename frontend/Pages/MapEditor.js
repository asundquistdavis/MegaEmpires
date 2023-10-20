import React, { useRef, forwardRef, useState, createRef, useMemo, useCallback } from "react";
import '/frontend/styles/mapeditor.scss';
import mapFile from '/frontend/assets/MegaCiv_Mapboard.jpg';


export default function MapEditor(props) {

    const maxScale = 5;
    const minScale = 1;
    const hexRef = createRef();
    const mapRef = createRef();
    const mapValues = useRef({scale:1, mx:0, my:0, moving: false, hovered: null, selected: null});
    function changeElement(elem, attr, value) {
        elem.attributes[attr].value = value
    };
    function transform(map, x, y, scale) {
        console.log(map.attributes.style);
    };
    const moveInBounds = () => {
        mapRef.current.scrollIntoView({block: 'nearest', inline:'nearest'});
    };
    const handleMouseDown = useCallback(()=>{
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
        if (mapValues.current.clicking) {
            const target = event.target;
            const isSelected = target.attributes.isselected.value === 'true';
            changeElement(target, 'fill', !isSelected? 'darkgreen': 'blue');
            changeElement(target, 'isselected', !isSelected);
        };
    }, [mapRef]);

    const handleMouseEnterHex = useCallback((event) => {
        const hovered = event.target;
        const isSelected = hovered.attributes.isselected.value === 'true';
        if (!isSelected) {
            mapValues.current.hovered = hovered;
            changeElement(hovered, 'fill', 'green');
        };
    }, [mapRef]);
    const handleMouseLeaveHex = useCallback((event) => {
        const hovered = mapValues.current.hovered;
        const isSelected = hovered? hovered.attributes.isselected.value==='true': false;
        if (hovered && !isSelected) {changeElement(hovered, 'fill', 'blue')};
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
    }, [mapRef])

    const Hexagon = forwardRef((props, ref) => useMemo(()=>{
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
        ref={ref} 
        d={`M${_x+_xOff} ${_y+_yStep} l${_xStep} ${-_yStep} l${_xStep} ${_yStep} v${2*_yStep} l${-_xStep} ${_yStep} l${-_xStep} ${-_yStep} z`} 
        fill="blue"
        stroke="black"
        onMouseDown={handleMouseDown}
        onMouseEnter={(event)=>handleMouseEnterHex(event)}
        onMouseLeave={(event)=>handleMouseLeaveHex(event)}
        onMouseUp={(event)=>handleMouseUpHex(event)}
        isselected="false"
        opacity={.3}
        />
    }, [mapRef]));

    const  map = useMemo(()=>{
        console.log('rendering map')
        // 208 * 71 ~= 15000 and 208 * 7px = 1600px
        // 52 * 17 ~= 884 and 52 * 28px = 1456px
        const points = Array.from(Array(190)).map((_, nx)=>Array.from(Array(80)).map((_, ny)=>[nx, ny])).flat(1)
        const hexagons = points.map(([nx, ny], key)=><Hexagon key={key} nx={nx} ny={ny} scale={10} ref={hexRef}/>);
        return <svg
        ref={mapRef}
        style={{backgroundImage: `url(${mapFile})`, backgroundSize: 'cover', backgroundPositionX: 0, backgroundPositionY: 0}}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeaveMap}
        onMouseUp={handleMouseUpMap}
        onMouseMove={handleMouseMoveMap}
        onWheel={(event)=>handleWheel(event)}
        width={1600}
        height={552}
        transform={`scale(1 1) translate(0 0)`}>
        {hexagons}
        </svg>
    }, []);

    function Overlay() {
        return <div style={{display: 'flex', justifyContent: 'end'}}>

        </div>
    };

    return <>
        <div className="board">
           {map}
        </div>
        <Overlay/>
    </>
};