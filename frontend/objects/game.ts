import { Civilization } from "./civilization";
import { Player } from "./player";

export class Game {

    civilizations: Array<Civilization>;
    players: Array<Player>;

    constructor(civilizations:Array<Civilization>, players:Array<Player>) {
        this.civilizations = civilizations;
        this.players = players;
    };
    
    getPlayer(id:string) {
        return this.players.find(player=>player.id===id);
    };
};
