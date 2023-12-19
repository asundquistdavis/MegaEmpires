import axios from "axios";
import { ElementUI, _new } from "../utilities";
import { Area, AreaLike, City, Cover, Support } from "../objects/area";
import '../styles/map.scss';
import '../styles/board.scss';

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
    _areaListeners: AbortController;
    _openSeaListeners: AbortController;
    _cityListeners: AbortController;
    _floodplainListeners: AbortController;
    _volcanoListeners: AbortController;
    
    // map state
    zoomLevel: number;
    scaleValue: number;
    x: number;
    y: number;
    moving: Boolean;
    clicking: Boolean;
    dblClicking: Boolean;
    hovered: Area|AreaLike;
    selected: Area|AreaLike;

    // triggers
    selectable: (area:Area|AreaLike)=>Boolean = ()=>true;
    hoverable: (area:Area|AreaLike)=>Boolean = ()=>true;
    clickAll: (area:Area|AreaLike) => void = ()=>{};
    clickSingle: (area:Area|AreaLike)=>void = ()=>{};
    clickDouble: (area:Area|AreaLike)=>void = ()=>{};
    hoverOn: (area:Area|AreaLike)=>void = ()=>{};
    hoverOff: (area:Area|AreaLike)=>void = ()=>{};
    

    constructor(board:HTMLElement) {
        this.board = board
        this.element = document.querySelector('#mapSVG') as SVGElement;
        this.areas = [];
        this.openSeas = [];
        this.cities = [];
        this.supports = [];
        this.volcanos = [];
        this.floodplains = [];
        this.areas = Array.from(document.querySelectorAll('path'))
        .filter(path=>path.getAttribute('type')==='coastal'||path.getAttribute('type')==='land')
        .map(path=>new Area(path));
        this.supports = Array.from(document.querySelectorAll('circle[support]')).map(circle=>{
            const support = new Support(circle as SVGElement);
            const areaL = this.get(support.name) as Area;
            areaL? areaL.support = support: null;
            return support;
        });
        this.cities = Array.from(document.querySelectorAll('path[type="city"]')).map(path=>{
            const city = new City(path as SVGElement);
            const areaL = this.get(city.name) as Area;
            areaL? areaL.city = city: null;
            return city;
        });
        this.volcanos = Array.from(document.querySelectorAll('path[type="volcano"]')).map(path=>new Volcano(path as SVGPathElement));
        this.floodplains = Array.from(document.querySelectorAll('path[type="floodplain"]')).map(path=>new Floodplain(path as SVGPathElement));
        this.openSeas = Array.from(document.querySelectorAll('path[type="water"]')).map(path=>new OpenSea(path as SVGPathElement));
        this._areaListeners = new AbortController();
        this._openSeaListeners = new AbortController();
        this._cityListeners = new AbortController();
        this._floodplainListeners = new AbortController();
        this._volcanoListeners = new AbortController();
        this.register();
        this.reset();
        this.scaleAround(this.scaleInitial, -this.boardWidth*this.scaleInitial, -this.boardHeight*this.scaleInitial);
        this.bound();
        this.render();
    };

    get(name:string): AreaLike|Area {
        return (
            this.areas.find(area=>area.name===name)||
            this.openSeas.find(openSea=>openSea.name===name)||
            this.volcanos.find(volcano=>volcano.name===name)||
            this.cities.find(city=>city.name===name)||
            this.floodplains.find(floodplain=>floodplain.name===name)
        );
    };

    hoverOnNative(area:Area|AreaLike) {
        const hover = area.copy();
        hover.setAttribute('hovered', '')
        this.hoveredGroup.appendChild(hover);
        this.hovered = area;
        area.hoveredElement = hover;
    };

    hoverOffNative(area:Area|AreaLike) {
        area.hoveredElement?.remove();
        area.hoveredElement = null;
        this.hovered = null;
    };

    selectNative(area:Area|AreaLike) {
        const selected = area.copy();
        selected.setAttribute('selected', '');
        this.selectedGroup.appendChild(selected);
        this.selected = area;
        area.selectedElement = selected;
    };

    unselectNative(area:Area|AreaLike) {
        const selected = this.selected
        if (!selected) {return}
        selected.selectedElement.remove();
        selected.selectedElement = null;
        this.selected = null;
    };

    color(mapper:(area:Area)=>string[], layerName:string, useCover:Boolean=false) {
        this.areas.forEach((area:Area)=>{
            const colors = mapper(area);
            if (colors.length===0) {return}
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

    unColor(layerName:string) {
        this.overlays.querySelectorAll(`path[layer][${layerName}]`).forEach(path=>path.remove())
    }

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
            this.unselectNative(area);
            if (select) {this.selectNative(area)};
        }
        this.clickAll(area);
        setTimeout(()=>{
            if (this.dblClicking) {this.clickDouble(area); this.dblClicking=false;}
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
        event.preventDefault();
        console.log(event);
    };

    touchUp (event:TouchEvent) {
        event.preventDefault();
        console.log(event);

    };

    touchMove(event:TouchEvent) {
        event.preventDefault();
        console.log(event);
    };

    register() {
        this.element.addEventListener('mouseleave', this.mouseLeave.bind(this));
        this.element.addEventListener('mousedown', this.mouseDown.bind(this));
        this.element.addEventListener('mouseup', this.mouseUp.bind(this));
        this.element.addEventListener('mousemove', this.mouseMove.bind(this));
        this.element.addEventListener('mousewheel', this.mouseWheel.bind(this));
        this.element.addEventListener('touchdown', this.touchDown.bind(this));
        this.element.addEventListener('touchup', this.touchUp.bind(this));
        this.element.addEventListener('touchmove', this.touchMove.bind(this));
        this.areaListeners = true;
        this.openSeaListeners = false;
        this.volcanoListeners = false;
        this.cityListeners = false;
        this.floodplainListeners = false;
    };

    set openSeaListeners(truth:Boolean) {
        this._openSeaListeners.abort();
        if (truth) {
        this.openSeas.forEach(openSea=>{
                openSea.element.addEventListener('mouseover', this.mouseOverArea.bind(this), {signal: this._openSeaListeners.signal});
                openSea.element.addEventListener('mouseout', this.mouseOutArea.bind(this), {signal: this._openSeaListeners.signal});
                openSea.element.addEventListener('mouseup', this.mouseUpArea.bind(this), {signal: this._openSeaListeners.signal});
            });
        }
    };

    set areaListeners(truth:Boolean) {
        this._areaListeners.abort();
        this._areaListeners = new AbortController();
        if (truth) {
        this.areas.forEach(area=>{
                area.element.addEventListener('mouseover', this.mouseOverArea.bind(this), {signal: this._areaListeners.signal});
                area.element.addEventListener('mouseout', this.mouseOutArea.bind(this), {signal: this._areaListeners.signal});
                area.element.addEventListener('mouseup', this.mouseUpArea.bind(this), {signal: this._areaListeners.signal});
            })
        };
    };

    set cityListeners(truth:Boolean) {
        this._cityListeners.abort();
        this._cityListeners = new AbortController();
        this.element.querySelector('g[name="cities"]').setAttribute('not-active', '');
        if (truth) {
            this.element.querySelector('g[name="cities"]').removeAttribute('not-active');
            this.cities.forEach(city=>{
                city.element.addEventListener('mouseover', this.mouseOverArea.bind(this), {signal: this._cityListeners.signal});
                city.element.addEventListener('mouseout', this.mouseOutArea.bind(this), {signal: this._cityListeners.signal});
                city.element.addEventListener('mouseup', this.mouseUpArea.bind(this), {signal: this._cityListeners.signal});
            })
        };
    };

    set volcanoListeners(truth:Boolean) {
        this._volcanoListeners.abort();
        this._volcanoListeners = new AbortController();
        this.element.querySelector('g[name="volcanos"]').setAttribute('not-active', '');
        if (truth) {
            this.element.querySelector('g[name="volcanos"]').removeAttribute('not-active');
            this.volcanos.forEach(volcano=>{
                console.log('here');
                volcano.element.addEventListener('mouseover', this.mouseOverArea.bind(this), {signal: this._volcanoListeners.signal});
                volcano.element.addEventListener('mouseout', this.mouseOutArea.bind(this), {signal: this._volcanoListeners.signal});
                volcano.element.addEventListener('mouseup', this.mouseUpArea.bind(this), {signal: this._volcanoListeners.signal});
            })
        }
    }

    set floodplainListeners(truth:Boolean) {
        this._floodplainListeners.abort();
        this._floodplainListeners = new AbortController();
        this.element.querySelector('g[name="floodplains"]').setAttribute('not-active', '');
        if (truth) {
            this.element.querySelector('g[name="floodplains"]').removeAttribute('not-active');
            this.floodplains.forEach(floodplain=>{
                floodplain.element.addEventListener('mouseover', this.mouseOverArea.bind(this), {signal: this._floodplainListeners.signal});
                floodplain.element.addEventListener('mouseout', this.mouseOutArea.bind(this), {signal: this._floodplainListeners.signal});
                floodplain.element.addEventListener('mouseup', this.mouseUpArea.bind(this), {signal: this._floodplainListeners.signal});
            })
        }
    }

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
        this.dblClickDelay = 300;
    };

};

class Volcano  extends AreaLike{

    constructor(element:SVGPathElement) {
        super(element)
    };
};

class Floodplain extends AreaLike{

    constructor(element:SVGPathElement) {
        super(element)
    };
};

class OpenSea extends AreaLike {

    constructor(element:SVGPathElement) {
        super(element);
    };
};

