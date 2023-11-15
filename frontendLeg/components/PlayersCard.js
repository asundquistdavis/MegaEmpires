import React from "react";
import '/frontend/styles/playerscard.scss';

const PlayersCard = (playerNumber, players, hover, setHover) => {

    if (!players) {
        return  <div className="overBoard card playersCardBorder">
            Loading...
        </div>;
    };

    
    const currentPlayerRow = <div className="playersCardPlayerRow playersCardCurrentPlayer">{players[playerNumber].username}</div>;
    
    const n = players.length
    const title = <div className="playersCardTitle">Players</div>
    const playerRow = (player, key) => {
        return key===playerNumber?
        currentPlayerRow:
        <div key={key} className="playersCardPlayerRow">
            {player.username}
        </div>
    };
    const playerRows = players.map(playerRow) 

    return <div className="overBoard card playersCardBorder" onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
        {hover? playerRows: currentPlayerRow}
    </div>;
};

export default PlayersCard;
