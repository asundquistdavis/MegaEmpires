import { Game } from "../objects/game";
import { Player } from "../objects/player";
import { Unit } from "../objects/unit";
import { User } from "../objects/user";
import { adjacencies } from "../phases/adjacencies";
import { BoardUI } from "./board";
import { ButtonUI } from "./button";
import { Connection } from "./connection";
import { GUI } from "./gui";

/*
client: {
    gui: {
        actionCard: CardUI,
        playerCard: CardUI,
        toolBar: BarUI,
        phasesBanner: BannerUI,
        optionsBar: BarUI,
    },
    board: {
        element (board): Element,
        map: {
            element (map): Element,
            areas: Array<Area>,
            supports: Array<Support>,
            cities: Array<City>,
            volcanos: Array<Volcano>,
            floodplains: Array<Floodplain>,
            openSeas: Array<OpenSea>,
        },
    },
    user: {
        info: PlayerInfo,
        tradeCards: Array<TradeCard>,
        advCards: Array<AdvCard>,

        ...
    }
    game: {
        players: Array<Player>,
        civilizations: Array<Civilization>,
        phase: int,
        ...
    }
}
*/

export class Client {

    connection:Connection;
    gui:GUI; // all overboard interactive comps
    board: BoardUI; // all map areas
    user: User; // the server-side player object associated with the client
    game: Game

    static async create() {
        const user = User.new()
        const connection = Connection.create(user);
        const gui = GUI.new('root');
        const board = await BoardUI.new('root');
        const game = new Game([], []);
        const client = new Client(gui, board, game, user, connection);
        gui.actionCard.show();
        return client;
    };

    constructor(gui:GUI, board:BoardUI, game:Game, clientPlayer:User, connection:Connection) {
        this.gui = gui;
        this.board = board;
        this.game = game;
        this.user = clientPlayer;
        this.connection = connection;
    };
    
    adjacencies = adjacencies
};

