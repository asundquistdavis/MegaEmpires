import { ElementUI, _new } from "../utilities";
import '../styles/tradeCard.scss';


type __TradeCard = {
    name:string;
    type:'non-tradable calamity'|'tradable calamity'|'commodity';
    level:number;
    pColor:string;
    sColor:string;
    tColor:string;
    pattern:'default';
    nMax:number;
};

type __Cary = {
    padding:number;
    height:number;
}

export class TradeCardUI extends ElementUI {

    name:string;
    type:'non-tradable calamity'|'tradable calamity'|'commodity';
    level:number;
    pColor:string;
    sColor:string;
    tColor:string;
    pattern:'default';
    height: number;
    padding: number;
    nMax:number;

    static from(parent:string, n:number, card:__TradeCard):TradeCardUI {
        const elem = document.createElement('div');
        elem.id = parent+'TradeCard#' + n;
        document.getElementById(parent).appendChild(elem);
        const cardUI = new TradeCardUI(parent+'TradeCard#'+n, card,);
        return cardUI
    }

    constructor(id:string, card:__TradeCard, carry:__Cary={padding: 0, height: 98}) {
        super(id);
        this.className = 'tradeCard';
        this.name = card.name;
        this.type = card.type;
        this.level = card.level;
        this.nMax = card.nMax;
        this.pColor = card.pColor;
        this.sColor = card.sColor;
        this.tColor = card.tColor;
        this.pattern = card.pattern;
        this.height = carry.height;
        this.padding = carry.padding;
        this.element.style.setProperty('--pColor', this.pColor);
        this.element.style.setProperty('--sColor', this.sColor);
        this.element.style.setProperty('--tColor', this.tColor);
        this.element.style.setProperty('--height', this.height + 'px');    
        this.element.style.setProperty('--padding', this.padding + 'px');
        const border = document.createElement('div');
        border.id = id + 'Border';
        border.className = 'tradeCardBorder';
        const body = document.createElement('div');
        body.id = id + 'Body';
        body.className = 'tradeCardBody';
        const top = document.createElement('div');
        top.id = id + 'Top';
        top.className = 'tradeCardTop';
        top.innerText = this.name;
        const middle = document.createElement('div');
        middle.id = id + 'Middle';
        middle.className = 'tradeCardMiddle';
        middle.innerText = this.level.toString();
        const bottom = document.createElement('div');
        bottom.id = id + 'Bottom';
        if (this.type==='commodity') {
            bottom.className = 'tradeCardBottom commodity'
            Array.from(Array(this.nMax)).forEach((_, n)=>{
                const elem = document.createElement('div');
                elem.id = id + 'Pill#' + n;
                elem.className = 'tradeCardPill'
                elem.innerText = ((this.nMax - n)**2 * this.level).toString();
                bottom.appendChild(elem);
            } );
        } else {
            bottom.className = 'tradeCardBottom Calamity';
            const calamity = document.createElement('div');
            calamity.id = id + 'Calamity';
            calamity.className = 'tradeCardCalamity';
            calamity.innerText = 'Calamity';
            bottom.appendChild(calamity);
            const tradable = document.createElement('div');
            tradable.id = id + 'Tradable';
            tradable.className = 'tradeCardTradable';
            tradable.innerText = this.type === 'non-tradable calamity'? 'Non-Tradable': 'Tradable';
            bottom.appendChild(tradable);
        };
        body.appendChild(top);
        body.appendChild(middle);
        body.appendChild(bottom);
        border.appendChild(body);
        this.element.appendChild(border);
    };
}

export class TradeCardHandIU extends ElementUI {

    // UIs
    _bar:ControlBarUI;
    _tradeCards:TradeCardUI[];

    // state
    _x:number;
    _clicking:boolean;
    _panning:boolean;
    
    // props
    get _N() {return this._tradeCards.length};
    get _cardWidth() {return this._tradeCards.length? this._tradeCards[0].element.clientWidth: 0}
    get _barWidth() {return this._bar.element.clientWidth||0}
    get _width() {return this.element.clientWidth || 0}
    get _left() {return this.element.clientLeft}
    _cardPadding = 5;

    static new(parent:string, name:string) {
        return _new(TradeCardHandIU, parent, name, 'div');
    }

    constructor(id:string) {
        super(id);
        this.className = 'tradeCardHand';
        this._x = 0;
        this._clicking = false;
        this._panning = false;
        this._bar = ControlBarUI.new(id, id+'Bar');
        this._bar.hide();
        this._tradeCards = [];
        this._register();
    }

    set tradeCards(cards:__TradeCard[]) {
        this._tradeCards.forEach(card=>card.element.remove());
        if ((this._cardWidth+this._cardPadding) * cards.length > this._width) {
            this._tradeCards = cards.map((card, n)=>{
                const cardUI = TradeCardUI.from(this.id, n, card);
                cardUI.element.setAttribute('data-need-scroll', '');
                return cardUI;
            });
            this.element.setAttribute('data-need-scroll', '');
            this._render();
            this._bar.show();
            return
        }
        this._tradeCards = cards.map((card, n)=>{ 
            return TradeCardUI.from(this.id, n, card);
        })

    }


    _positionOfBarPX():string { console.log(this._x,  this._left); return this._x  - this._barWidth/2 + 'px';};

    _positionOfCardPX(cardNumber:number):string { // needs work
        const l = this._left;
        const x = this._x - l;
        const a = (this._width-this._cardWidth)*Math.tanh(-1+cardNumber/(this._N-1))/Math.PI*4;
        const b = 0//(this._width-this._cardWidth)*Math.tanh((1-cardNumber/(this._N-1)))/Math.PI*4;
        const c = (cardNumber) + 1/2
        const d = this._N/(this._width-this._cardWidth)
        const e = Math.exp(-(d*x - c))
        console.log(l, x, a, b, c, d, e);
        return (l + a - b / ( 1 + e ) ).toString() + 'px'
    }

    _render() {
        this._bar.element.style.left = this._positionOfBarPX();
        this._tradeCards.forEach((card, n)=>{
            card.element.style.left = this._positionOfCardPX(n)
        });
    }

    _onMouseDownBar() {this._clicking = true; this._panning = true;};

    _onMouseUp() {this._panning = false};

    _onMouseOut() {this._panning = false};

    _onMouseMove(event:MouseEvent) {
        if (!this._panning) {return}
        this._clicking = false;
        const tx = event.clientX;
        if ((tx + this._barWidth/2 > this._width) || (tx - this._barWidth/2 < 0)) {return}
        this._x = tx;
        this._render();
    }

    _register() {
        this.element.addEventListener('mousedown', this._onMouseDownBar.bind(this))
        this.element.addEventListener('mousemove', this._onMouseMove.bind(this))
        this.element.addEventListener('mouseleave', this._onMouseOut.bind(this));
        this.element.addEventListener('mouseup', this._onMouseUp.bind(this));
    }
}

export class ControlBarUI extends ElementUI {

    static new(parent:string, name:string) {
        return _new(ControlBarUI, parent, name, 'div')
    }

    constructor(id:string) {
        super(id);
        this.className = 'tradeCardControlBar';
    }
}