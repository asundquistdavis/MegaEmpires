import { ElementUI, _new, _on } from '../utilities';
import { HeaderUI } from './header';
import { RulerUI } from './ruler';
import { SwitchUI } from './switch';
import '/frontend/styles/card.scss'

export class CardUI extends ElementUI{

    element: HTMLElement;
    header: HeaderUI;
    ruler: RulerUI;
    content: ContentUI;

    static on(target:ElementUI) {
        return _on(CardUI, target, 'Card', 'div');
    };

    static new(parent:string, name:string) {
        return _new(CardUI, parent, name, 'div')
    };

    constructor(id:string) {
        super(id);
        this.element.className = 'card';
        this.header = HeaderUI.on(this);
        this.ruler = RulerUI.on(this);
        this.content = ContentUI.on(this);
        this.hide();
    };

    reset() {
        this.header.reset();
    };

};

export class ContentUI extends ElementUI{

    static on(target:ElementUI) {
        return _on(ContentUI, target, 'Content', 'div');
    };
};
