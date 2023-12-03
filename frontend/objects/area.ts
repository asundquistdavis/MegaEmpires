import { Player } from "./player";
import { PlayerArea } from "./playerarea";

export class Area {

    // elements
    element: SVGElement;
    selectedElement: SVGPathElement;
    hoveredElement: SVGPathElement;
    overlayElements: Array<SVGElement>;
    support: Support;
    city: City;
    cover: Cover;
    
    // area props
    name: string;
    
    // player info
    client: PlayerArea;
    otherPlayers: Array<PlayerArea>;

    static is(element:SVGElement) {
        return new Area(element);
    };

    constructor(element:SVGElement, ) {
        this.element = element;
        this.name = this.element.getAttribute('name');
        this.cover = this.element.getAttribute('type')==='coastal'? new Cover(document.querySelector(`path[type="cover"][name="${this.name}"]`)): null;
        this.otherPlayers = [];
        this.overlayElements = [];
    };

    get(player:Player) {
        if (player.user) {return player.areas.find(area=>area.area.name===this.name)};
        return this.otherPlayers.find(player=>player.area.name=this.name);
    };

    copy(useCover:Boolean=false, maskCover:Boolean=false):SVGPathElement {
        let id = '';
        if (maskCover&&this.cover) {
            const mask = document.createElement('mask');
            mask.appendChild(this.cover.element.cloneNode());
            id = this.name + 'Mask' + Math.floor(Math.random()*1000).toString()
            mask.id = id
        };
        const copy = ((useCover&&this.cover)? this.cover.element.cloneNode(): this.element.cloneNode()) as SVGPathElement;
        if (!copy) {return}
        const attrs = Object.values(copy.attributes).filter(attr=>((attr.name!=='d')&&(attr.name!=='name')));
        attrs.forEach(attr=>copy.removeAttribute(attr.name));
        maskCover? copy.setAttribute('mask', 'url(#' + id + ')'): null;
        return copy
    };

};

export class Support {

    element: Element;
    textElement: Element;
    name: string;

    constructor(element:SVGElement, ) {
        this.element = element;
        this.name = this.element.getAttribute('name');
        this.textElement = document.querySelector(`text[name="${this.name}"]`);
    };

};

export class City {

    element: Element;
    name: string;

    constructor(element:SVGElement, ) {
        this.element = element;
        this.name = this.element.getAttribute('name');
    };

};

export class Cover {

    element: Element;
    name: string;

    constructor(element:SVGElement, ) {
        this.element = element;
        this.name = this.element.getAttribute('name');
    };

};
