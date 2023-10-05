import React from "react";
import Area from "./Area";
import Draggable from "react-draggable";
import '/frontend/styles/board.scss'
import map from '/frontend/assets/MegaCiv_Mapboard.jpg'
import Hexagon from "./Hexagon";

const Board = (props) => {

    const {areaDatas, width, height, mapState, setMapState, setOtherState} = props;

    const board_width = 500;
    const board_height = 250

    const mapAspectRatio = 227/656;

    const _width = width || 1000*mapState.zoomLevel;
    const _height = height || (mapAspectRatio*_width);

    const handleZoom = (event) => {
        const direction = event.deltaY>0?-1:event.deltaY===0?0:1;
        console.log(event);
        setMapState(state=>({...state, x: -board_width/4, y: -board_height/4, zoomLevel: (state.zoomLevel+direction<=10&&state.zoomLevel+direction>0)?state.zoomLevel+direction:state.zoomLevel}))
    };

    const l = 5;
    
    const arrX = Array.from(Array(Math.floor(_width/(Math.sqrt(3)/2*l*mapState.zoomLevel)))).map((_, index)=>index);
    const arrY = Array.from(Array(Math.floor(_height/(3/4*l*mapState.zoomLevel)))).map((_, index)=>index);

    const hexDatas = arrX.map(nx=>arrY.map(ny=>({nx, ny, l}))).flat(1);

    return <>
        <div className="boardFrame" onWheel={handleZoom}>
            <Draggable bounds={{top:board_height-_height-mapState.y, left:board_width-_width-mapState.x, right:-mapState.x, bottom:-mapState.y}} positionOffset={{x: mapState.x, y: mapState.y}}>
                <div  style={{backgroundImage: `url(${map})`, backgroundSize: 'cover', width: `${_width}px`, height: `${_height}px`}}>
                    <svg width={_width} height={_height}>
                        {hexDatas.map((hexData, key)=><Hexagon key={key} hexData={hexData} scale={mapState.zoomLevel} setMapState={setMapState}/>)}
                    </svg>
                </div>
            </Draggable>
        </div>
    </>
};

export default Board;
