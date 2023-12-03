import { ElementUI, _new, _on } from "../utilities";
import { ModalUI } from "./modal";

export class BadgeUI extends ElementUI{

    element: HTMLElement;
    modal: ModalUI;
    onClick: (event:MouseEvent)=>void

    static on(target:ElementUI) {
        return _on<BadgeUI>(BadgeUI, target, 'Badge', 'div');
    };

    static new(parent:string, name:string) {
        return _new<BadgeUI>(BadgeUI, parent, name, 'div')
    };

};

export class BarUI extends ElementUI {

    element: HTMLElement;
    badges: Array<BadgeUI>;

    static on(target:ElementUI) {
        return _on<BarUI>(BarUI, target, 'Modal', 'div');
    };

    static new(parent:string, name:string) {
        return _new<BarUI>(BarUI, parent, name, 'div');
    };
};
