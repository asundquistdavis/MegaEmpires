import React from "react";
import '/frontend/styles/playerscard.scss';

const PlayersCard = (players) => {

    if (!players) {
        return  <div className="overBoard card playersCardBorder">
            Loading...
        </div>;
    }

    const n = players.length
    const title = <div className="playersCardTitle">Players</div>
    const playerRow = (player, key) => {
        return <div key={key} className="playersCardPlayerRow">
            {player.username}
        </div>
    };
    const playerRows = players.map(playerRow) 

    return <div className="overBoard card playersCardBorder">
        {playerRows}
    </div>;
};

export default PlayersCard;
