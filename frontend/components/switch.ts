import { ElementUI, _new } from "../utilities";

export class SwitchUI extends ElementUI{

    element: HTMLElement;
    selectedPath: ElementUI;
    paths: Array<ElementUI>;

    static new(parent:string, name:string) {
        return _new(SwitchUI, parent, name, 'div');
    };

    constructor(id:string) {
        super(id);
        this.selectedPath = null;
        this.paths = [];
    };

    addNew<T extends ElementUI>(UI:{new:(parent:string, name:string)=>T}, name:string):T {
        const path = UI.new(this.element.id, name);
        this.paths.push(path);
        if (!this.selectedPath)  {this.selectedPath = path; return path;};
        path.hide();
        return path;
    };

    select(name:string) {
        this.selectedPath.hide();
        this.selectedPath = this.paths.find(path=>path.element.id===name);
        this.selectedPath.show();
    };

}
