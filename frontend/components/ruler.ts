import { ElementUI, _new, _on } from "../utilities";

export class RulerUI extends ElementUI {

    element:HTMLHRElement

    static on(target:ElementUI) {
        return _on(RulerUI, target, 'Ruler', 'hr');
    };

    static new(parent:string, name:string) {
        return _new(RulerUI, parent, name, 'hr');
    };

    constructor(id:string) {
        super(id);
    };
};
