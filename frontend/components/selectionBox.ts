import { ElementUI, _new, randint, toCamel } from "../utilities";
import '../styles/selectionBox.scss';

type Option = {name:string, onSelect: (event:MouseEvent)=>void, text:String, ui:ElementUI};

export class SelectionBox extends ElementUI {

    element: HTMLElement;
    options: Array<Option>;
    _title: HTMLElement;
    _body: HTMLElement;

    set title(value:string) {this._title.innerText = value};

    static new(parent:string, name:string) {
        return _new(SelectionBox, parent, name, 'div');
    };

    addOption(onSelect: (event:MouseEvent)=>void, text:string, name:string):Option {
        const ui = ElementUI.new(this._body.id, this.element.id + 'Option' + toCamel(text)) as ElementUI;
        const option:Option = {name, onSelect, text, ui};
        ui.element.addEventListener('click', (event:MouseEvent)=>onSelect(event));
        ui.text = text;
        ui.className = 'selectionBoxOption';
        this.options.push(option);
        return option;
    };

    removeOption(name:string) {
        const index = this.options.findIndex(option=>{if (option.name===name) {option.ui.element.remove(); return true}});
        this.options.splice(index, 1);
    };

    removeAllOptions() {
        this.options.forEach((option:Option)=>{
            option.ui.element.remove();
        });
        this.options = [];
    };

    constructor(id:string) {
        super(id);
        this.options = [];
        this.className = 'selectionBox';
        this._title = document.createElement('div');
        this._title.id = this.id+'Title';
        this._body = document.createElement('div');
        this._body.id = this.id+'Body';
        this.element.appendChild(this._title);
        this.element.appendChild(this._body);
    };

};