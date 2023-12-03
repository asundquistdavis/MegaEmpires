
export function capitalize(string:string) {return string? string[0].toUpperCase()+string.slice(1): ''};

export function title(string:string) {return string? string.split(' ').map(capitalize).join(' '): ''};

export class ElementUI {

    element: HTMLElement;
    parts: Array<ElementUI>

    static on(target:ElementUI):ElementUI {
        return _on(ElementUI, target, 'Element', 'div');
    };

    static new(parent:string, name:string):ElementUI|Promise<ElementUI> {
        return _new(ElementUI, parent, name, 'div');
    };

    constructor(id:string) {
        this.element = document.getElementById(id);
    };

    show() {
        this.element.style.display = 'block';
    };

    hide() {
        this.element.style.display = 'none';
    };

    clear() {
        this.text = '';
        this.hide();
    };

    set text(text:string|number) {
        this.element.innerText = typeof text === 'number'? text.toString(): text;
    };

    set display(text:string|number) {
        this.text = text;
        this.show();
    };

    set html(html:string) {
        this.element.innerHTML = html;
    };

    set className(className:string) {
        this.element.className = className;
    };

};

export function _on<Type>(ComponentClass: { new (id:string): Type}, target:ElementUI, append:string, elementType:string): Type {
    const element = document.createElement(elementType);
    const parent = target.element.id;
    element.id = parent+append;
    target.element.appendChild(element);
    return new ComponentClass(parent+append);
};

export function _new<Type>(ComponentClass: { new (id:string): Type}, parent:string, name:string, elementType:string): Type {
    const element = document.createElement(elementType);
    element.id = name;
    document.getElementById(parent).appendChild(element);
    return new ComponentClass(name);
};
