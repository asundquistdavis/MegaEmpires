import { randint, toCamel } from "../utilities";
import { Civilization } from "./civilization";
import { Player } from "./player";
import { PlayerArea } from "./playerarea";

export class AreaLike {
    element:SVGElement;
    name: string;
    selectedElement: SVGElement;
    hoveredElement: SVGElement;
    overlayElements: Array<SVGElement>;
    cover:AreaLike|null;
    type: string

    constructor(element:SVGElement) {
        this.element = element;
        this.name = this.element.getAttribute('name');
        this.overlayElements = [];
        this.selectedElement = null;
        this.hoveredElement = null;
        this.cover = null;
        this.type = this.element.getAttribute('type');
    }

    copy(useCover:Boolean=false):SVGPathElement {
        const copy = ((useCover&&this.cover)? this.cover.element.cloneNode(): this.element.cloneNode()) as SVGPathElement;
        if (!copy) {return};
        const attrs = Object.values(copy.attributes).filter(attr=>((attr.name!=='d')&&(attr.name!=='name')));
        attrs.forEach(attr=>copy.removeAttribute(attr.name));
        copy.setAttribute('overlay', '')
        return copy;
    };
}

export class Area extends AreaLike{

    // elements
    element: SVGElement;
    selectedElement: SVGElement;
    hoveredElement: SVGElement;
    overlayElements: Array<SVGElement>;
    support: Support;
    city: City;
    startingCivilization: Civilization;
    isStartingArea: boolean;
    landAdjacent: string[];
    waterAdjacent: string[];

    // cover: Cover;
    
    // area props
    name: string;
    
    // player info
    client: PlayerArea;
    otherPlayers: Array<PlayerArea>;

    static is(element:SVGElement) {
        return new Area(element);
    };

    constructor(element:SVGElement, ) {
        super(element);
        this.cover = this.element.getAttribute('type')==='coastal'? new Cover(document.querySelector(`path[type="cover"][name="${this.name}"]`)): null;
        this.otherPlayers = [];
        this.city = null;
        this.support = null;
    };

    get(player:Player) {
        if (player.user) {return player.areas.find(area=>area.area.name===this.name)};
        return this.otherPlayers.find(player=>player.area.name=this.name);
    };

};

export class Support {

    element: Element;
    textElement: Element;
    name: string;
    value:number;

    constructor(element:SVGElement, ) {
        this.element = element;
        this.name = this.element.getAttribute('name');
        this.textElement = document.querySelector(`text[name="${this.name}"]`);
        this.value = parseInt(this.element.getAttribute('value'));
    };

};

export class City extends AreaLike{

    constructor(element:SVGElement, ) {
        super(element)
    };

};

export class Cover extends AreaLike {

    name: string;

    constructor(element:SVGElement, ) {
        super(element);
    };

};
