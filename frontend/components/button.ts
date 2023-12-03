import '/frontend/styles/button.scss';
import { ElementUI, _new, _on } from "../utilities";


export class ButtonUI extends ElementUI{

    onClick: (event: MouseEvent)=>void;

    static on(target:ElementUI) {
        return _on(ButtonUI, target, 'Button', 'button');
    };

    static new(parent:string, name:string) {
        return _new(ButtonUI, parent, name, 'button')
    };

    constructor(id:string) {
        super(id);
        this.className = 'btn'
        this.element.addEventListener('click', (event:MouseEvent)=>this.onClick?.(event));
    };

    set html(text:string) {
        if (text) {
            this.className = 'btnIco'
        };
        this.element.innerHTML = text;
    };

};