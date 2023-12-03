import '/frontend/styles/modal.scss';
import { ElementUI, _on, _new } from "../utilities";
import { RulerUI } from "./ruler";
import { HeaderUI } from "./header";
import { ButtonUI } from "./button";
import { closeICO } from '../icons';
import { BadgeUI } from './bar';

export class ModalUI extends ElementUI {

    element: HTMLDivElement;
    elementType: 'div';
    header: HeaderUI;
    ruler: RulerUI;
    closeBtn: ButtonUI;

    static badge(name:string='modal', text:string, badgeIco:string, modalTarget:string='root', badgeTarget:string='badges') {
        const modal = ModalUI.new(modalTarget, name);
        modal.header.title = text;
        const badge = BadgeUI.new(badgeTarget, name+'Badge')
        badge.html = badgeIco;
        badge.onClick = () => modal.show();
        return badge;
    };

    static on(target:ElementUI) {
        return _on<ModalUI>(ModalUI, target, 'Modal', 'div');
    };

    static new(parent:string, name:string) {
        return _new<ModalUI>(ModalUI, parent, name, 'div');
    }

    constructor(id:string) {
        super(id);
        this.element.className = 'modalOverlay';
        const card = document.createElement('div');
        card.id = id+'Card'
        card.className = 'modalCard';
        this.element.appendChild(card);
        this.header = HeaderUI.new(id+'Card', id+'Header');
        this.ruler = RulerUI.new(id+'Card', id+'Ruler');
        this.closeBtn = ButtonUI.new(id+'HeaderRight', id+'Close');
        this.closeBtn.html = closeICO(20, 20, 'red');
        this.closeBtn.onClick = () => {this.hide()};
        this.hide()
    };

};
