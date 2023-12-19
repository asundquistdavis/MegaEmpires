import { ElementUI, _new, title } from "../utilities";
import '../styles/settingsrow.scss';

export class SettingRowUI extends ElementUI {

    value: SettingValueUI;
    options: Array<SettingValueUI>;

    static new(parent:string, name:string) {
        return _new(SettingRowUI, parent, name, 'div');
    };

    constructor(element:string) {
        super(element);
    };
};

export class SettingValueUI {

    value:string;

    constructor(value:string) {
    };
};

export class TextInputRowUI extends ElementUI {

    key: ElementUI;
    value: InputUI;
    onChange: (value:string)=>void;

    static new(parent:string, name:string) {
        return _new(TextInputRowUI, parent, name, 'div');
    };
    
    constructor(id:string) {
        super(id);
        this.key = ElementUI.new(this.element.id, this.element.id + 'Key') as ElementUI;
        this.value = InputUI.new(this.element.id, this.element.id + 'Value');
        this.element.setAttribute('textInputRow', '');
        this.value.element.setAttribute('textInputBox', '');
        this.onChange = ()=>{};
        this.value.element.onchange = event => this.onChange(this.value.value);
    }

}

export class InputUI extends ElementUI {
    
    element: HTMLInputElement
    _type: 'text'|'number';
    _value:string;

    static new(parent:string, name:string) {
        return _new(InputUI, parent, name, 'input');
    };
    
    constructor(id:string) {
        super(id);
        this._value = '';
    }

    set type(type:'text'|'number') {
        if ((type !== 'text') && (type !== 'number')) {return};
        this.element.setAttribute('type', type);
        this._type = type;
    }

    set min(value:string) {
        this.element.setAttribute('min', value)
    }

    set max(value:string) {
        this.element.setAttribute('max', value)
    }

    set value(value:string) {
        this.element.setAttribute('value', value);
    }

    get value() {return this.element.getAttribute('value')}
    
    set disabled(truth:boolean) {
        truth? this.element.setAttribute('disabled', ''): this.element.removeAttribute('disabled')
    }

}

export class CheckBoxRowUI extends ElementUI {

    key:ElementUI;
    _value: ElementUI;
    _truth:boolean;
    onClick: (truth:boolean)=>boolean;
    disabled:boolean;

    static new(parent:string, name:string) {
        return _new(CheckBoxRowUI, parent, name, 'div');
    };
    
    constructor(id:string) {
        super(id);
        this._truth=false;
        this.element.setAttribute('checkBoxRow', '');
        this.key = ElementUI.new(this.element.id, this.element.id + 'Key') as ElementUI;
        this._value = ElementUI.new(this.element.id, this.element.id + 'Value') as ElementUI;
        this._value.element.setAttribute('checkBoxBool', '');
        this.onClick = ()=>true;
        this.disabled = false;
        this._value.element.addEventListener('click', (event:MouseEvent)=>{(!this.disabled&&this.onClick(this.value))? this.value=!this._truth: null});
    };

    set value(truth:boolean) {
        truth? this._value.element.setAttribute('checked', ''): this._value.element.removeAttribute('checked');
        this._truth = truth;
    };

    get value() {return this._truth}

};

export class DropDownOptionUI extends ElementUI {

    color:string

    static createNew(parent: string, obj:{name:string, color:string}) {
        const _new = DropDownOptionUI.new(parent, obj.name);
        _new.text = title(obj.name);
        _new.value = obj.name
        obj.color? _new.color = obj.color: null;
        obj.color? _new.element.style.backgroundColor = obj.color:null;
        return _new
    }

    static new(parent:string, name:string) {
        return _new(DropDownOptionUI, parent, name, 'option');
    };

    constructor(id:string) {
        super(id);
        this.color = null
    }

    set value(value:string) {this.element.setAttribute('value', value)};

    get value() {return this.element.getAttribute('value')};
}

export class DropDownSelectUI extends ElementUI {

    selected: DropDownOptionUI;

    static new(parent:string, name:string) {
        return _new(DropDownSelectUI, parent, name, 'select');
    };

    constructor(id:string) {
        super(id);
        this.selected = null;
    }

}

export class DropDownOptionRowUI extends ElementUI{

    key:ElementUI;
    value:DropDownSelectUI;
    defaultOption: DropDownOptionUI;
    options: DropDownOptionUI[];
    onSelect: (option:DropDownOptionUI)=>void;

    static defaultOption(parent:string):DropDownOptionUI {
        const defaultOption =  DropDownOptionUI.new(parent, parent+'DefaultOPtion');
        defaultOption.value = 'defaultOption';
        defaultOption.text = 'Default Option';
        defaultOption.color = 'white';
        defaultOption.element.style.backgroundColor = defaultOption.color;
        return defaultOption
    };

    static new(parent:string, name:string) {
        return _new(DropDownOptionRowUI, parent, name, 'div');
    };

    constructor(id:string) {
        super(id);
        this.key = ElementUI.new(id, id + 'Key') as ElementUI;
        this.value = DropDownSelectUI.new(id, id + 'Select');
        this.element.setAttribute('dropDownOptionRow', '');
        this.defaultOption = DropDownOptionRowUI.defaultOption(id+'Select');
        this.select(this.defaultOption);
        this.options = [this.defaultOption]
        this.value.element.onchange = (event) => {
            const name = (event.target as HTMLSelectElement).value;
            console.log(name, this.options)
            const option = this.options.find(option=>option.value===name);
            this.value.element.style.backgroundColor = option.color||'white';
            this.onSelect(option);
        };
    };

    select(option: DropDownOptionUI) {
        this.value.selected = option;
        this.value.element.style.backgroundColor = option.color;
        (this.value.element as HTMLSelectElement).value = option.value
    }
};

