import { Area } from "./area";
import { Player } from "./player";
import { Unit } from "./unit";



export class PlayerArea {

    area: Area;
    units: Array<Unit>;
    info: Player;
    hasCity: Boolean;

    constructor(area:Area, info:Player, units:Array<Unit>=[], hasCity:Boolean=false) {
        this.units = units;
        this.area = area;
        this.info = info;
        this.hasCity = hasCity
    };

    get doesOccupy():Boolean {return this.hasCity||this.units.length>0}

};

