import axios from "axios";
import { Client } from "./components/client";
import { GUI } from "./components/gui";
import { BoardUI } from "./components/board";
import { Area } from "./objects/area";
import { Connection } from "./components/connection";
import { Civilization } from "./objects/civilization";
import { Player } from "./objects/player";
import { Unit } from "./objects/unit";
import { PlayerArea } from "./objects/playerarea";
import { User } from "./objects/user";
import { Game } from "./objects/game";



async function generateCivilizations(): Promise<Array<Civilization>> {
    const civilizationPrimitives:Array<{name:string, color:string}> = (await axios.get('./json/civs.json')).data?.civs
    return civilizationPrimitives.map(primitive=>new Civilization(primitive.name, primitive.color));
}

function randomString(l:number, useNumbers:Boolean=false, useSpecialChars:Boolean=false):string {
    const chars = 'abcdefghijklmnopqrstuvwxyz' + (useNumbers? '123456789': '') + (useSpecialChars? '!@#$%^&*()[]{}<>?': '');
    const arr = randomSlice(Array.from(chars), l);
    const string = arr.join('');
    return string;
};

function randomSlice<T>(array:Array<T>, l:number): Array<T> {
    const L = array.length;
    const randomMember = () => array[Math.floor(Math.random()*L)];
    const slice = Array.from(Array(l)).map(randomMember);
    return slice
};

function generatePlayers(n:number, civilizations:Array<Civilization>) {
    const players = Array.from(Array(n)).map((_, i)=>new Player(randomString(10, true), randomString(20, true, true), randomString(10), civilizations[i]));
    return players;
};

function distributeAreas(areas:Array<Area>, players:Array<Player>) {
    areas.forEach(area=>{
        let addPlayer = !Math.floor(Math.random()*2);
        while (addPlayer) {
            const player = players[Math.floor(Math.random()*players.length)];
            const units = Array.from(Array(Math.floor(Math.random()*2)+1)).map(()=>new Unit(randomString(5, true), player, area));
            const hasCity = !units.length;
            const playerArea = new PlayerArea(area, player, units, hasCity);
            !player.user? area.otherPlayers.push(playerArea): area.client = playerArea;
            player.areas.push(playerArea);
            player.units.push(...units);
            addPlayer = !Math.floor(Math.random()*2);
        };
    });
};

export async function test() {

    const colors = (area:Area):string[] => {
        if (area.otherPlayers.length===0) {return ['transparent']};
        return area.otherPlayers.map(player=>player.info.civilization.color);
        
    };

    const client = await Client.create();
};

