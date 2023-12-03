import { Player } from '../objects/player';
import { PlayerArea } from '../objects/playerarea';
import '../styles/board.scss';
import axios from "axios";

class UIComponent {

    element:Element;

    constructor(element: Element) {
        this.element = element;
    };

    style() {};
};

export class Support {

    circle: SVGCircleElement;
    number: SVGTextElement;
    ready: Boolean;
    name:string;
    value: number;

    constructor(circle:SVGCircleElement, number:SVGTextElement) {
        this.circle = circle;
        this.number = number;
        this.ready = !!(this.circle&&this.number);
        this.name = circle?.getAttribute('name');
        this.value = parseInt(circle?.getAttribute('value'));
    };

    show() {
        if (this.ready) {
            this.circle.style.display = 'block';
            this.number.style.display = 'block';
        };
    };
    
    hide() {
        if (this.ready) {
            this.circle.style.display = '';
            this.number.style.display = '';
        };
    };

};

export class Volcano {
    
    path:SVGPathElement;

    constructor(path:SVGPathElement) {
        this.path = path;
    };

};

export class FloodPlain {

    path:SVGPathElement;

    constructor(path:SVGPathElement) {
        this.path = path;
    };

};

export class City {

    path:SVGPathElement;
    ready:Boolean;
    _owner: Player|null;

    constructor(path:SVGPathElement) {
        this.path = path;
        this.ready = !!this.path;
    };

    show() {
        if (this.ready) {
            this.path.style.display = 'block';
        };
    };

    hide() {
        if (this.ready) {
            this.path.style.display = 'initial';
        };
    };

    set owner(player:Player) {this._owner=player; this.path}

};

export class Cover {

    element: SVGPathElement;
    name:string

    constructor(element:SVGPathElement) {
        this.element = element;
        this.name = element?.getAttribute('name');
    };


    copy():Element|null {
        if (this.element) {
            const copy = this.element?.cloneNode() as Element;
            const attrs = Object.values(copy?.attributes).filter(attr=>((attr.name!=='d')&&(attr.name!=='name')));
            attrs.forEach(attr=>copy.removeAttribute(attr.name));
            return copy
        };
        return null;
    };
};

export class Area extends UIComponent {

    selected: Element;
    hovered: Element;
    overlays: Array<Element>;
    name: string;
    support: Support;
    city: City;
    client: PlayerArea;
    otherPlayers: Array<PlayerArea>;
    cover: Cover;
    isCoastal: Boolean;
    isSelected: Boolean;
    
    constructor(element: Element) {
        super(element)
        this.selected = null;
        this.hovered = null;
        this.overlays = [];
        this.name = this.element.getAttribute('name');
        this.support = new Support(document.querySelector(`circle[support][name="${this.name}"`), document.querySelector(`text[support][name="${this.name}"`));
        this.city = new City(document.querySelector(`path[type="city"][name="${this.name}"]`));
        this.cover = new Cover(document.querySelector(`path[type="cover"][name="${this.name}"]`));
        this.isCoastal = this.element.getAttribute('type') === 'coastal';
        this.otherPlayers = [];
    };

    copy():Element|null {
        if (this.element) {
            const copy = this.element.cloneNode() as Element;
            const attrs = Object.values(copy.attributes).filter(attr=>((attr.name!=='d')&&(attr.name!=='name')));
            attrs.forEach(attr=>copy.removeAttribute(attr.name));
            return copy
        };
        return null;
    };

    addOverlay(register: string, useCover:Boolean, ...attrs:Array<[string, string]>) {
        let overlay:Element = null;
        if (overlay = document.querySelector(`path[overlay][register="${register}"][name="${this.name}"]`)) {return overlay};
        overlay = useCover&&this.isCoastal? this.cover.copy(): this.copy();
        if (overlay) {
            overlay.setAttribute('overlay', '');
            overlay.setAttribute('register', register);
            attrs.forEach(attr=>overlay.setAttribute(...attr));
            const group = document.querySelector('g[name="overlay"]');
            group.appendChild(overlay);
            this.overlays.push(overlay);
            return overlay;
        };
        return null;
    };

    colorByCivilizations(useCover:Boolean) {
        !this.otherPlayers.length? this.addOverlay('civilization', useCover, ['fill', this.client.doesOccupy? this.client.info.civilization.color: 'currentColor'])
        : this.otherPlayers.forEach(player=>this.addOverlay('civilization', useCover, ['fill', player.info.civilization.color], ['contested', '']))
    };

    colorBySupport(useCover:Boolean) {
        this.addOverlay('support', useCover, ['value', this.support.value.toString()], ['support', ''])
    };

    center() {
        const path = this.element.getAttribute('d');
        const x = parseFloat(path.split('M')[1].split(' ')[0]);
        const y = parseFloat(path.split('M')[1].split(' ')[1]);
        return [x, y];
    };

    getPlayerArea(player:Player) {return !player.user? this.otherPlayers.find(pa=>pa.info.id===player.id): this.client};
    
};

export class Board extends UIComponent {

    map: Element;
    
    // map objects
    areas: Array<Area>;
    cities: Array<City>;
    volcanos: Array<Volcano>;
    floodplains: Array<FloodPlain>
    selected: Area|null;
    hovered: Area|null;
   
    // groups
    selectedGroup: Element|null;
    hoveredGroup: Element|null;
    supportGroup: Element|null;
    overlayGroup: Element|null;
    
    // scaling/zooming
    scaleInitial: number;
    zoomLevel: number;
    zoomLevelMin: number;
    zoomLevelMax: number;
    scaleFactor: number;
    scaleValue: number;
    
    // moving/panning
    moving: Boolean;
    mapWidth: number;
    mapHeight: number;
    xValue: number;
    yValue: number;
    xMap: number;
    yMap: number;
    xStart: number;
    yStart: number;

    //selecting 
    clicking: Boolean;
    dblClicking: Boolean;
    selectable: (area:Area)=>Boolean;
    togglable: (area:Area)=>Boolean;
    click: (area:Area) => void;
    clickAction: (area:Area)=>void;
    dblClickAction: (area:Area)=>void;
    dblClickDelay: number;

    // hovering
    hoverable: (area:Area)=>Boolean;
    sticky: (area:Area)=>Boolean;
    hoverAction: (area:Area)=>void;
    unhoverAction: (area:Area)=>void;

    static async new(id:string='map', parent:string='root') {
        const mapFile = await axios.get('./map.html');
        const map = document.createElement('div');
        map.id = id;
        map.innerHTML = mapFile.data;
        document.getElementById(parent).appendChild(map);
        const board = new Board(map);
        return board;
    };

    constructor(element:HTMLElement) {
        super(element);
        this.map = element.querySelector('#mapSVG');
        const paths = Array.from(element.querySelectorAll('path'));
        this.areas = paths.filter(path=>path.getAttribute('type')==='coastal'||path.getAttribute('type')==='land').map(area=>new Area(area));
        this.cities = paths.filter(path=>path.getAttribute('type')==="city").map(city=>new City(city));
        this.volcanos = paths.filter(path=>path.getAttribute('type')==='volcano').map(volcano=>new Volcano(volcano));
        this.floodplains = paths.filter(path=>path.getAttribute('type')==='floodplain').map(floodplain=>new FloodPlain(floodplain));
        this.selectedGroup = this.element.querySelector('g[name="selected"]');
        this.hoveredGroup = this.element.querySelector('g[name="hovered"]');
        this.supportGroup = this.element.querySelector('g[name="supports"]');
        this.overlayGroup = this.element.querySelector('g[name="overlay"]');
        this.zoomLevel = 1;
        this.mapWidth = parseInt(this.map.getAttribute('width'));
        this.mapHeight = parseInt(this.map.getAttribute('height'));
        this.zoomLevelMin = 1;
        this.zoomLevelMax = 10;
        this.scaleInitial = this.boardHeight/this.mapHeight;
        this.scaleFactor = 1.25;
        this.scaleValue = 1;
        this.xValue = 0;
        this.yValue = 0;
        this.xMap = 0;
        this.yMap = 0;
        this.xStart = 0;
        this.yStart = 0;
        this.registerListeners();
        this.scaleMap(this.scaleInitial, -this.boardWidth*this.scaleInitial, -this.boardHeight*this.scaleInitial);
        this.boundMap();
        this.transformMap();
        this.dblClickDelay = 300;
    };

    get boardWidth() {return document.getElementById('map').offsetWidth};

    get boardHeight() {return document.getElementById('map').offsetHeight};

    get overlays() {return Array.from(document.querySelectorAll('g[name="overlay"] path'))};

    find(element:Element) {
        return this.areas.filter(area=>area.element===element)?.[0];
    };

    findByName(name:string) {
        return this.areas.filter(area=>area.name===name)?.[0];
    };

    getArea(areaName:string) {
        return this.areas.find(area=>area.name===areaName);
    }

    removeSelected() {
        Array.from(this.element.querySelectorAll('path[selected]')).forEach(selected=>{selected.remove()});
    };

    removeHovered() {
        Array.from(this.element.querySelectorAll('path[hovered]')).forEach(hovered=>hovered.remove());
    };

    hideSupports() {
        this.supportGroup.setAttribute('hide', '')
    };

    styleSelect(area: Area) {
        const copy = area.copy();
        copy.setAttribute('selected', '');
        this.selectedGroup.appendChild(copy);
        this.selected = area;
        area.selected = copy;
    };

    styleUnselect() {
        const area = this.selected;
        if(!area) {return}
        area.selected?.remove();
        area.selected = null;
        this.selected = null;
    };

    styleHover(area: Area) {
        const copy = area.copy();
        copy.setAttribute('hovered', '')
        this.hoveredGroup.appendChild(copy);
        this.hovered = area;
        area.hovered = copy;
    };

    styleUnhover(area:Area) {
        area.hovered?.remove();
        area.hovered = null;
        this.hovered = null;
    };

    transformMap() {
        this.map.setAttribute('transform', `matrix(${this.scaleValue} 0 0 ${this.scaleValue} ${this.xMap} ${this.yMap})`);
    };

    panMapBy(dx:number, dy:number) {
        this.xMap+=dx;
        this.yMap+=dy;
        this.boundMap();
        this.transformMap();
    };

    panMapTo(cx:number, cy:number) {
        this.xMap += this.boardWidth/2 - cx;
        this.yMap += this.boardHeight/2 - cy;
        this.boundMap();
        this.transformMap();
    };

    scaleMap(scaleFactor: number, x:number, y:number) {
        this.xMap -= this.boardWidth/2;
        this.yMap -= this.boardHeight/2;
        this.scaleValue *= scaleFactor;
        this.xMap *= scaleFactor;
        this.yMap *= scaleFactor;
        this.xMap += this.mapWidth*(scaleFactor-1)/2;
        this.yMap += this.mapHeight*(scaleFactor-1)/2;
        this.xMap += (this.boardWidth - x);
        this.yMap += (this.boardHeight - y);
        this.boundMap();
        this.transformMap();
    };
    
    boundMap() {
        const left = this.mapWidth/2*(this.scaleValue-1);
        const right = this.boardWidth - this.mapWidth - left;
        const top = this.mapHeight/2*(this.scaleValue-1);
        const bottom = document.getElementById('map').offsetHeight - this.mapHeight - top;
        if (this.xMap<right) {this.xMap = right};
        if (this.xMap>left) {this.xMap = left};
        if (this.yMap<bottom) {this.yMap = bottom};
        if (this.yMap>top) {this.yMap = top};
    };

    registerListeners() {
        const mouseOverArea = (event:Event) => { // hover
            const area = this.find(event.target as Element);
            const hoverable = this.hoverable? this.hoverable(area): true;
            if (!hoverable) {return}
            this.styleHover(area);
            this.hoverAction(area);
        };

        const mouseUpArea = (event:MouseEvent) => {

            if (!(event.detail===1)) {this.dblClicking = true; return};
            if (!this.clicking) {return};
            const area:Area = this.find(event.target as Element);
            const selectable = this.selectable? this.selectable(area): true;
            const select = selectable && !area.selected;
            if (selectable) {
                this.styleUnselect()
                if (select) {this.styleSelect(area)};
            };
            this.click?.(area);
            setTimeout(()=>{
                if (this.dblClicking) {this.dblClickAction?.(area)}
                else {this.clickAction?.(area)};
            }, this.dblClickDelay);
        };

        const mouseOutArea = (event:Event) => {
            const area = this.find(event.target as Element);
            this.styleUnhover(area);
            this.unhoverAction(area);
        };

        const mouseDown = (event:Event) => {
            this.clicking = true;
            this.moving = true;
            this.dblClicking = false;
        };

        const mouseMove = (event:MouseEvent) => {
            this.clicking = false;
            const dx = event.movementX;
            const dy = event.movementY;
            if (this.moving) {
                this.panMapBy(dx, dy);
            }
        };

        const mouseUp = (event:MouseEvent) => {
            this.moving = false;
            this.clicking = false;
        };

        const mouseWheel = (event:WheelEvent) => {
            event.preventDefault();
            const zoomLevelTarget = this.zoomLevel + (event.deltaY < 0? 1: -1);
            if (zoomLevelTarget<this.zoomLevelMin||zoomLevelTarget>this.zoomLevelMax) {return}
            const scaleFactor = event.deltaY < 0? this.scaleFactor: 1/this.scaleFactor;
            const x = event.clientX;
            const y = event.clientY;
            this.zoomLevel+= event.deltaY<0? 1: -1;
            this.scaleMap(scaleFactor, x, y);
            this.boundMap();
            this.transformMap();
            this.zoomLevel=zoomLevelTarget;
        };

        const mouseLeave = (event:MouseEvent) => {
            this.moving = false;
        };

        const onTouchStart = (event:TouchEvent) => {
            this.moving = true;
            this.clicking = true;
            if (event.changedTouches.length === 1) {
                this.xStart = event.changedTouches[0].clientX;
                this.yStart = event.changedTouches[0].clientY;
            };
        };

        const onTouchMove = (event:TouchEvent) => {
            this.clicking = false;
            if (event.changedTouches.length === 1) {
                const dx = (event.changedTouches[0].clientX - this.xStart);
                const dy = (event.changedTouches[0].clientY - this.yStart);
                this.panMapBy(dx, dy);
                this.xStart += dx;
                this.yStart += dy;
            };
        };

        const onTouchEnd = (event:TouchEvent) => {
            this.moving = false;
        };

        this.areas.forEach(area=>area.element.addEventListener('mouseover', mouseOverArea));
        this.areas.forEach(area=>area.element.addEventListener('mouseup', mouseUpArea));
        this.areas.forEach(area=>area.element.addEventListener('mouseout', mouseOutArea));
        this.element.addEventListener('mousedown', mouseDown);
        this.element.addEventListener('mousemove', mouseMove);
        this.element.addEventListener('mouseup', mouseUp);
        this.element.addEventListener('mousewheel', mouseWheel);
        this.element.addEventListener('mouseleave', mouseLeave);
        this.element.addEventListener('touchstart', onTouchStart);
        this.element.addEventListener('touchmove', onTouchMove);
        this.element.addEventListener('touchend', onTouchEnd);
    };

};
