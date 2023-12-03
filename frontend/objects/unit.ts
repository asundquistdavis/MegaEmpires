import { Area } from "./area";
import { Player } from "./player";


export class Unit {

    id: string;
    player: Player;
    expanding: Boolean;
    area: Area;

    constructor(id:string, player:Player, area:Area, expanding:Boolean=false) {
        this.id = id;
        this.player = player;
        this.area = area;
        this.expanding = expanding;
    };

};
