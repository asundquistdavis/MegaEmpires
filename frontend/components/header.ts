import { ElementUI, _new, _on } from "../utilities";

export class HeaderUI extends ElementUI{

    static on(target:ElementUI) {
        return _on(HeaderUI, target, 'Header', 'div')
    };

    static new(parent:string, name:string) {
        return _new(HeaderUI, parent, name, 'div');
    };
    
    element: HTMLElement;
    _left: Element;
    _right: Element;
    _title: Element;

    constructor(id:string) {
        super(id);
        this.element.className = 'headerRow';
        const headerText = document.createElement('div');
        headerText.id = id+'Text';
        headerText.className = 'Text';
        const headerLeft = document.createElement('div');
        headerLeft.id = id+'Left'
        const headerRight = document.createElement('div');
        headerRight.id = id+'Right'
        this.element.appendChild(headerLeft);
        this.element.appendChild(headerText);
        this.element.appendChild(headerRight);
        this._left = headerLeft;
        this._right = headerRight;
        this._title = headerText;
    };

    set title(text:string|Element) {this._title.innerHTML = typeof text === 'string'? text: text.outerHTML};
    set left(text:string|Element) {this._left.innerHTML = typeof text === 'string'? text: text.outerHTML};
    set right(text:string|Element) {this._right.innerHTML = typeof text === 'string'? text: text.outerHTML};

    reset() {
        this.title = '';
        this.right = '';
        this.left = '';
    };

};
