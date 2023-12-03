import axios from "axios";
import { ElementUI, _new } from "../utilities";
import { Area, City, Cover, Support } from "../objects/area";

export class BoardUI extends ElementUI {

    element: HTMLElement;
    map: Map;

    static async new(parent:string='root') {
        const board = _new(BoardUI, parent, 'board', 'div');
        board.html = (await axios.get('./map.html')).data;
        board.map = new Map(board.element);
        return board;
    };
};

export class Map {

    board:HTMLElement;
    element:SVGElement;
    hoveredGroup = document.querySelector('g[name="hovered"]');
    selectedGroup = document.querySelector('g[name="selected"]');
    overlays = document.querySelector('g[name="overlay"]');

    // map components
    areas:Array<Area>;
    supports:Array<Support>;
    cities:Array<City>;
    volcanos:Array<Volcano>;
    floodplains:Array<Floodplain>;
    openSeas:Array<OpenSea>;

    // map properties
    scaleInitial: number;
    scaleFactor: number;
    zoomLevelMin: number;
    zoomLevelMax: number;
    xInitial: number;
    yInitial: number;
    mapWidth: number;
    mapHeight: number;
    dblClickDelay: number;
    get boardWidth() {return this.board.offsetWidth};
    get boardHeight() {return this.board.offsetHeight};
    
    // map state
    zoomLevel: number;
    scaleValue: number;
    x: number;
    y: number;
    moving: Boolean;
    clicking: Boolean;
    dblClicking: Boolean;
    hovered: Area;
    selected: Area;

    // triggers
    selectable: (area:Area)=>Boolean = ()=>true;
    hoverable: (area:Area)=>Boolean = ()=>true;
    clickAll: (area:Area) => void = ()=>{};
    clickSingle: (area:Area)=>void = ()=>{};
    clickDouble: (area:Area)=>void = ()=>{};
    hoverOn: (area:Area)=>void = ()=>{};
    hoverOff: (area:Area)=>void = ()=>{};
    

    constructor(board:HTMLElement) {
        this.board = board
        this.element = document.querySelector('#mapSVG') as SVGElement;
        this.areas = Array.from(document.querySelectorAll('path'))
        .filter(path=>path.getAttribute('type')==='coastal'||path.getAttribute('type')==='land')
        .map(path=>new Area(path));
        this.supports = Array.from(document.querySelectorAll('circle[support]')).map(circle=>{
            const support = new Support(circle as SVGElement);
            this.get(support.name).support = support;
            return support;
        });
        this.cities = Array.from(document.querySelectorAll('path[city]')).map(path=>{
            const city = new City(path as SVGElement);
            this.get(city.name).city = city;
            return city;
        });
        this.volcanos = Array.from(document.querySelectorAll('path[volcano]')).map(path=>new Volcano(path as SVGPathElement));
        this.floodplains = Array.from(document.querySelectorAll('path[floodplain]')).map(path=>new Floodplain(path as SVGPathElement));
        this.openSeas = Array.from(document.querySelectorAll('path[type="water"]')).map(path=>new OpenSea(path as SVGPathElement));
        this.register();
        this.reset();
        this.scaleAround(this.scaleInitial, -this.boardWidth*this.scaleInitial, -this.boardHeight*this.scaleInitial);
        this.bound();
        this.render();
    };

    get(name:string): Area {
        return this.areas.find(area=>area.name===name);
    };

    hoverOnNative(area:Area) {
        const hover = area.copy();
        hover.setAttribute('hovered', '')
        this.hoveredGroup.appendChild(hover);
        this.hovered = area;
        area.hoveredElement = hover;
    };

    hoverOffNative(area:Area) {
        area.hoveredElement?.remove();
        area.hoveredElement = null;
        this.hovered = null;
    };

    selectNative(area:Area) {
        const selected = area.copy();
        selected.setAttribute('selected', '');
        this.selectedGroup.appendChild(selected);
        this.selected = area;
        area.selectedElement = selected;
    };

    unselectNative(area:Area) {
        const selected = this.selected
        if (!selected) {return}
        selected.selectedElement.remove();
        selected.selectedElement = null;
        this.selected = null;
    };

    color(mapper:(area:Area)=>string[], layerName:string, useCover:Boolean=false) {
        this.areas.forEach((area:Area)=>{
            const colors = mapper(area);
            const contested = colors.length > 1;
            colors.forEach((color, index)=>{
                const layer = area.copy(useCover);
                if (!layer) {return};
                layer.setAttribute(layerName, '');
                layer.setAttribute('layer', '');
                contested? layer.setAttribute('contested', index.toString()): null;
                layer.style.fill = color;
                this.overlays.appendChild(layer);
                area.overlayElements.push(layer);
            });
        });
    };

    panTo(x:number, y:number) {        
        this.x += this.boardWidth/2 - x;
        this.y += this.boardHeight/2 - y;
    };
    
    panBy(dx:number, dy:number) {
        this.x+=dx;
        this.y+=dy;
    };
    
    bound() {
        const left = this.mapWidth/2*(this.scaleValue-1);
        const right = this.boardWidth - this.mapWidth - left;
        const top = this.mapHeight/2*(this.scaleValue-1);
        const bottom = this.boardHeight - this.mapHeight - top;
        if (this.x<right) {this.x = right};
        if (this.x>left) {this.x = left};
        if (this.y<bottom) {this.y = bottom};
        if (this.y>top) {this.y = top};
    };
    
    scaleAround(s:number, x:number, y:number) {
        this.x -= this.boardWidth/2;
        this.y -= this.boardHeight/2;
        this.scaleValue *= s;
        this.x *= s;
        this.y *= s;
        this.x += this.mapWidth*(s-1)/2;
        this.y += this.mapHeight*(s-1)/2;
        this.x += (this.boardWidth - x);
        this.y+= (this.boardHeight - y);
    };
    
    render() {
        this.element.setAttribute('transform', `matrix(${this.scaleValue} 0 0 ${this.scaleValue} ${this.x} ${this.y})`);
    };

    mouseOverArea(event:MouseEvent) {
        const element = event.target as Element;
        const area = this.get(element.getAttribute('name'));
        const hoverable = this.hoverable? this.hoverable(area): true;
        if (!hoverable) {return};
        this.hoverOn(area);
        this.hoverOnNative(area);
    };
    
    mouseOutArea(event:MouseEvent) {
        const element = event.target as Element;
        const area = this.get(element.getAttribute('name'));
        this.hoverOffNative(area);
        this.hoverOff(area);
    };
    
    mouseUpArea(event:MouseEvent) {
        if (!(event.detail===1)) {this.dblClicking = true; return};
        if (!this.clicking) {return};
        const element = event.target as Element;
        const area = this.get(element.getAttribute('name'));
        const selectable = this.selectable(area);
        const select = selectable && !area.selectedElement;
        if (selectable) {
            // console.log('here')
            this.unselectNative(area);
            if (select) {this.selectNative(area)};
        }
        this.clickAll(area);
        setTimeout(()=>{
            if (this.dblClicking) {this.clickDouble(area)}
            else {this.clickSingle(area)}
        }, this.dblClickDelay);
    };
    
    mouseLeave(event:MouseEvent) {
        this.moving = false;
        this.clicking = false;
    };

    mouseDown(event:MouseEvent) {
        this.moving = true;
        this.clicking = true;
    };

    mouseUp(event:MouseEvent) {
        this.moving = false;
        this.clicking = false;
    };

    mouseMove(event:MouseEvent) {
        this.clicking = false;
        const dx = event.movementX;
        const dy = event.movementY;
        if (this.moving) {
            this.panBy(dx, dy);
            this.bound();
            this.render();
        };
    };

    mouseWheel(event:WheelEvent) {
        event.preventDefault();
        const zoomLevelTarget = this.zoomLevel + (event.deltaY < 0? 1: -1);
        if (zoomLevelTarget<this.zoomLevelMin||zoomLevelTarget>this.zoomLevelMax) {return}
        const scaleFactor = event.deltaY < 0? this.scaleFactor: 1/this.scaleFactor;
        const x = event.clientX;
        const y = event.clientY;
        this.zoomLevel+= event.deltaY<0? 1: -1;
        this.scaleAround(scaleFactor, x, y);
        this.bound();
        this.render();
        this.zoomLevel=zoomLevelTarget;
    };

    touchDown (event:TouchEvent) {

    };

    touchUp (event:TouchEvent) {

    };

    touchMove(event:TouchEvent) {

    };

    register() {
        this.areas.forEach(area=>{
            area.element.addEventListener('mouseover', this.mouseOverArea.bind(this));
            area.element.addEventListener('mouseout', this.mouseOutArea.bind(this));
            area.element.addEventListener('mouseup', this.mouseUpArea.bind(this));
        });
        this.element.addEventListener('mouseleave', this.mouseLeave.bind(this));
        this.element.addEventListener('mousedown', this.mouseDown.bind(this));
        this.element.addEventListener('mouseup', this.mouseUp.bind(this));
        this.element.addEventListener('mousemove', this.mouseMove.bind(this));
        this.element.addEventListener('mousewheel', this.mouseWheel.bind(this));
        this.element.addEventListener('touchdown', this.touchDown.bind(this));
        this.element.addEventListener('touchup', this.touchUp.bind(this));
        this.element.addEventListener('touchmove', this.touchMove.bind(this));
    };

    reset() {
        this.scaleFactor = 1.25;
        this.zoomLevelMax = 10;
        this.zoomLevelMin = 1;
        this.mapWidth = parseFloat(this.element.getAttribute('width'));
        this.mapHeight = parseFloat(this.element.getAttribute('height'));
        this.zoomLevel = 1;
        this.scaleInitial = this.boardHeight/this.mapHeight;
        this.scaleValue = 1;
        this.x = 0;
        this.y = 0;
    };

};

class Volcano {

    element:SVGPathElement;
    name:string;

    constructor(element:SVGPathElement) {
        this.element = element;
        this.name = element.getAttribute('name');
    };
};

class Floodplain {

    element:SVGPathElement;
    name:string;

    constructor(element:SVGPathElement) {
        this.element = element;
        this.name = element.getAttribute('name');
    };
};

class OpenSea {

    element:SVGPathElement;
    name:string;

    constructor(element:SVGPathElement) {
        this.element = element;
        this.name = element.getAttribute('name');
    };
};

