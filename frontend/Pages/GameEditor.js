import React, { createRef, useMemo, useRef, useState } from "react";
import mapFile from '/frontend/assets/MegaCiv_Mapboard.jpg'
import '/frontend/styles/gameeditor.scss';

export default function GameEditor(props) {

    const { appState, setAppState } = props;
    const { mapAreas, mapMeta } = appState;
    const { resolution, Nx, Ny } = mapMeta;

    const mapWidth = 1600;
    const mapHeight = 552;
    const scaleMin = 1 
    const scaleMax = 10

    const mapValues = useRef({
        x: 0,
        y: 0,
        scale: scaleMin,
        clicking: false,
        moving: false,
    });


    const mapRef = createRef();

    const changeElement = (elem, attr, value) => {
        elem.attributes[attr].value = value;
    };

    class _Area {

        static from = (area) => {
            return new _Area(area.name, area.type, area.points, area.cityPoint, area.floodPlainPoints, area.volcanoPoint, area.isFlood, area.support, area.waterPoints)
        };
        constructor(name, type, points, cityPoint, floodPlainPoints, isFlood, support, waterPoints) {
            this.name = name;
            this.type = type;
            this.points = points;
            this.cityPoint = cityPoint;
            this.floodPlainPoints = floodPlainPoints;
            this.volcanoPoint = this.volcanoPoint;
            this.isFlood = isFlood;
            this.support = support;
            this.waterPoints = waterPoints;
        };
        render() {
            const boundPoint = (point) => {
                const tl = !this.points.some(other=>((other.nx==point.nx)&&(other.ny==point.ny-1)));
                const tr = !this.points.some(other=>((other.nx==point.nx+1)&&(other.ny==point.ny-1)));
                const r = !this.points.some(other=>((other.nx==point.nx+1)&&(other.ny==point.ny)));
                const br = !this.points.some(other=>((other.nx==point.nx+1)&&(other.ny==point.ny+1)));
                const bl = !this.points.some(other=>((other.nx==point.nx)&&(other.ny==point.ny+1)));
                const l = !this.points.some(other=>((other.nx==point.nx-1)&&(other.ny==point.ny)));
                return new _Point(point.nx, point.ny, tl, tr, r, br, bl, l);
            };
            const enterArea = (event) => {
                console.log(event.target)
                changeElement(event.target, 'fill', 'green')
            };
            const leaveArea = (event) => {
                changeElement(event.target, 'fill', 'white')
            };
            const pointsBounds = this.points.map(boundPoint)
            const draw = (point) => _Point.from(point).render()
            return <g
            stroke="black"
            key={this.id}
            id={`mapArea${this.id}`}
            strokeLinecap="round" 
            strokeWidth={.5} 
            onMouseEnter={enterArea}
            onMouseLeave={leaveArea}
            >
                {pointsBounds.map(draw)}
            </g>
        };
    };

    class _Point {
        static from = (point) => new _Point(point.nx, point.ny, point.tl, point.tr, point.r, point.br, point.bl, point.l);
        
        constructor(nx, ny, tl, tr, r, br, bl, l) {
            this.nx = nx;
            this.ny = ny;
            this.tl = tl;
            this.tr = tr;
            this.r = r;
            this.br = br; 
            this.bl = bl;
            this.l = l;
        };

        render() {
            const _packingWidth = Math.sqrt(3)/2*resolution;
            const _packingHeight = 3/4*resolution;
            const _xStep =  _packingWidth/2;
            const _yStep = _packingHeight/3;
            const _x = _packingWidth*(this.nx-1) + resolution - (this.ny%2? _xStep: 0);
            const _y = _packingHeight*this.ny;

            return (<>
            {/* <g key={`${this.nx}x${this.ny}y`} stroke="black"> */}
                    {/* <path
                    nx={this.nx}
                    ny={this.ny}
                    fill="white"
                    stroke=""
                    strokeOpacity={0}
                    d={`m${_x} ${_y} l${_xStep} ${-_yStep} l${_xStep} ${_yStep} v${2*_yStep} l${-_xStep} ${_yStep} l${-_xStep} ${-_yStep} z`}
                    /> */}
                    {this.tl? <path d={`m${_x} ${_y}l${_xStep} ${-_yStep}`}/>:null}
                    {this.tr? <path d={`m${_x+_xStep} ${_y-_yStep}l${_xStep} ${_yStep}`}/>:null}
                    {this.r? <path d={`m${_x+2*_xStep} ${_y}v${2*_yStep}`}/>:null}
                    {this.br? <path d={`m${_x+2*_xStep} ${_y+2*_yStep}l${-_xStep} ${_yStep}`}/>:null}
                    {this.bl? <path d={`m${_x+_xStep} ${_y+3*_yStep}l${-_xStep} ${-_yStep}`}/>:null}
                    {this.l? <path d={`m${_x} ${_y}v${2*_yStep}`}/>:null}
           {/* </g> */}
            </>
            );
        }
    };

    const draw = (area) => _Area.from(area).render()

    const handleMouseDown = (event) => {
        mapValues.current.moving = true;
        mapValues.current.clicking = true;
    };

    const handleMouseMove = (event) => {
        if (mapValues.current.moving) {
            const boardWidth = mapRef.current.parentNode.clientWidth;
            const boardHeight = mapRef.current.parentNode.clientHeight;
            const scale = mapValues.current.scale;
            const xMin = (1-1/scale)*mapWidth;
            const yMin = (1-1/scale)*mapHeight;
            const xMax = (boardWidth-mapWidth-yMin*scale)
            const yMax = boardHeight-mapHeight-yMin;
            const x = mapValues.current.x;
            const y = mapValues.current.y;
            const dx = event.movementX;
            const dy = event.movementY;
            const tx = x+dx;
            const ty = y+dy;
            console.log(scale, yMin, ty, yMax);
            const ix = (tx>xMin||xMax>xMin)? xMin: tx<xMax? xMax: tx;
            const iy = (ty>yMin||yMax>yMin)? yMin: ty<yMax? yMax: ty;
            mapValues.current.x = ix;
            mapValues.current.y = iy;
            changeElement(mapRef.current,'transform', `translate(${mapValues.current.x} ${mapValues.current.y}) scale(${mapValues.current.scale} ${mapValues.current.scale})`);
        };
    };

    const handleMouseUp = () => {
        mapValues.current.moving = false;
        mapValues.current.clicking = false;
    }; 

    const handleWheel = (event) => {
        // const boardWidth = mapRef.current.parentNode.clientWidth;
        // const boardHeight = mapRef.current.parentNode.clientHeight;
        // const px = event.clientX/mapValues.current.scale-boardWidth/2;
        // const py = event.clientY/mapValues.current.scale-boardHeight/2;
        const tScale = mapValues.current.scale + (event.deltaY>0? -1: 1);
        console.log(tScale, mapValues.current.x, mapValues.current.y)
        mapValues.current.scale = tScale<=scaleMin? scaleMin: tScale>scaleMax? scaleMax: tScale;
        // const tx = -px*mapValues.current.scale;
        // const ty = -py*mapValues.current.scale;
        // mapValues.current.x = tx;
        // mapValues.current.y = ty;
        changeElement(mapRef.current,'transform', `translate(${mapValues.current.x} ${mapValues.current.y}) scale(${mapValues.current.scale} ${mapValues.current.scale})`);
    };

    const handleMouseLeave = () => {
        mapValues.current.moving = false;
    };

    const  map = useMemo(()=>{
        return <svg
        ref={mapRef}
        tabIndex={0}
        style={{backgroundImage: `url(${mapFile})`, backgroundSize: 'cover', backgroundPositionX: 0, backgroundPositionY: 0, position: "absolute", top:0}}
        width={1600}
        height={552}
        transform={`scale(1 1) translate(0 0)`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onMouseLeave={handleMouseLeave}
        >{mapAreas.map(draw)}
        </svg>
    }, []);

    return <div style={{overflow:"hidden", position: "absolute", left:0, top:0, width:'100%', height:'100%'}}>
        {map}
    </div>
};
