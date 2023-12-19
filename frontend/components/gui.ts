import { ElementUI, _new } from "../utilities";
import { BarUI } from "./bar";
import { CardUI } from "./card"
import { SwitchUI } from "./switch";
import '../styles/gui.scss';

export class GUI extends ElementUI{

    element: HTMLElement;
    actionCard: CardUI|SwitchUI;
    playerCard: CardUI;
    toolBar: BarUI;
    optionsBar: BarUI;
    info: CardUI;

    static new(parent:string='root') {
        const gui = _new(GUI, parent, 'gui', 'div');
        gui.actionCard = CardUI.new('gui', 'actionCard');
        gui.playerCard = CardUI.new('gui', 'playerCard');
        gui.toolBar = BarUI.new('gui', 'toolBar');
        gui.optionsBar = BarUI.new('gui', 'optionsBar');
        gui.info = CardUI.new('gui', 'info');
        return gui;
    
    };

}