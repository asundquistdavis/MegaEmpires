import React from "react";
import '/frontend/styles/board.scss';
import map from '/frontend/assets/MegaCiv_Mapboard.jpg';

const Board = () => {

    return <>
        <div className="boardContainer">
            <div style={{background: `url(${map})`, width: '100%', height: '100%'}}></div>
        </div>
    </>;
};

export default Board;
