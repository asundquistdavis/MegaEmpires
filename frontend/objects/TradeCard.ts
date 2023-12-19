

export class TradeCard {

    name:string;
    type:'non-tradable calamity'|'tradable calamity'|'commodity';
    level:number;
    pColor:string;
    sColor:string;
    tColor:string;
    pattern:'default';
    nMax:number;

    constructor(name:string, type:'non-tradable calamity'|'tradable calamity'|'commodity', level:number, nMax:number, pColor:string, sColor:string, tColor:string, pattern:'default'='default') {
        this.name = name;
        this.type = type;
        this.level = level;
        this.nMax = nMax;
        this.pColor = pColor;
        this.sColor = sColor;
        this.tColor = tColor;
        this.pattern = pattern;
    }
}