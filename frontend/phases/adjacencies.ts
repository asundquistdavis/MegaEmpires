import { ButtonUI } from "../components/button";
import { CardUI, ContentUI } from "../components/card";
import { Client } from "../components/client"
import { RulerUI } from "../components/ruler";
import { SwitchUI } from "../components/switch";
import { Area } from "../objects/area"
import { ElementUI, title } from "../utilities";

export function adjacencies(this:Client) {
    
    type Layer = {name:string, element:SVGPathElement, water:Boolean};

    const adjacencyMap:Array<{name:string, landAdjacent:Array<Area>, waterAdjacent:Array<Area>}> = this.board.map.areas.map(area=>({...area, landAdjacent: [], waterAdjacent: []}));

    const layers:Array<Layer> = [];

    this.gui.actionCard.element.remove();
    this.gui.actionCard = SwitchUI.new(this.gui.element.id, 'actionCard');
    const selectAreaUI = this.gui.actionCard.addNew(CardUI, 'selectArea');
    const editAreaUI = this.gui.actionCard.addNew(CardUI, 'editArea');

    selectAreaUI.header.title = 'Select an Area';

    (ElementUI.new(editAreaUI.content.element.id, 'landAdjacentText') as ElementUI).text = 'Land Adjacent';
    RulerUI.new(editAreaUI.content.element.id, 'landAdjacentHR');
    const landAdjacentUI = ElementUI.new(editAreaUI.content.element.id, 'landAdjacencyUI');
    (ElementUI.new(editAreaUI.content.element.id, 'waterAdjacentText') as ElementUI).text = 'Water Adjacent';
    RulerUI.new(editAreaUI.content.element.id, 'waterAdjacentHR');
    const waterAdjacentUI = ElementUI.new(editAreaUI.content.element.id, 'waterAdjacencyUI');

    selectAreaUI.show();
//     const toggleLayer = (area:Area, water:Boolean=false) => {
//         const existingIndex = layers.findIndex(layer=>(layer.name===area.name)&&(layer.water===water));
//         if (!existingIndex) { 
//             layers.splice(existingIndex, 1);
//             return
//         };
//         const element = area.copy(true, water);
//         element.setAttribute('softLight', '');
//         layers.push({element, name:area.name, water});
//     };

//     const clearLayers = () => {
//         layers.filter(layer=>{layer.element.remove(); return false});
//     };

//     this.board.map.clickAll = (area:Area) => {
//         this.gui.actionCard.content.clear();
//         const selected = this.board.map.selected;
//         if (!selected) {
//             clearLayers();
//             this.gui.actionCard.header.title = action1;
//         };
//         if (selected===area) {
//             this.gui.actionCard.header.title = title(area.name)
//         };
//     };

//     this.board.map.clickSingle = (area:Area) => {

//     };

//     this.board.map.clickDouble = (area:Area) => {

//     };

//     this.board.map.selectable = (area:Area) => {
//         if (!this.board.map.selected) { return true};
//         if (area === this.board.map.selected) {return true};
//         return false;
//     };
}
