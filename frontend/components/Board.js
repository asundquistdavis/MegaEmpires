import React, { forwardRef, useMemo } from "react";
import '/frontend/styles/board.scss';
// const mapUrl = require('/frontend/assets/west-map.html')

const Board = forwardRef(function(props, ref) {
    const { } = props;
    return <iframe ref={ref} id="boardFrame" style={{position: "absolute", top:0, left:0, width: '100%', height: '100%', overflow: "hidden"}} src='/static/west-map.html'></iframe>
});
export default Board;
