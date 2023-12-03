import { Civilization } from "./civilization";
import { PlayerArea } from "./playerarea";
import { Unit } from "./unit";
import { User } from "./user";


export class Player {

    constructor(id:string, email:string, handle:string, civilization: Civilization, user:User=null) {
        this.id = id;
        this.user = user;
        this.email = email;
        this.handle = handle;
        this.civilization = civilization;
        this. units = [];
        this.areas = [];
    };

    id: string
    email: string;
    handle: string;
    civilization: Civilization;
    user: User
    units: Array<Unit>;
    areas: Array<PlayerArea>;

};
