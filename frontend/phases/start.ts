import axios from "axios";
import { Client } from "../components/client";
import { Area } from "../objects/area";
import { CustomAreaData } from "./adjacencies";
import { Civilization } from "../objects/civilization";
import { title } from "../utilities";
import '../styles/start.scss';
import { SwitchUI } from "../components/switch";
import { CardUI } from "../components/card";
import { CheckBoxRowUI, DropDownOptionRowUI, DropDownOptionUI } from "../components/settingRow";

export async function start(this:Client) {

    const civilizations:Civilization[] = (await axios.get('./json/civs.json')).data.civs

    const addCustomAreaData = async () => {
        const customAreaData:CustomAreaData[] = (await axios.get('./json/areas.json')).data
        this.board.map.areas.forEach((area:Area)=>{
            const CAD = customAreaData.find(CAD=>CAD.name===area.name);
            if (!CAD) {console.log(area); return};
            area.startingCivilization = civilizations.find(civ=>civ.name===(CAD.startingCivilization as unknown));
            area.isStartingArea = CAD.isStartingArea;
            area.landAdjacent = CAD.landAdjacent;
            area.waterAdjacent = CAD.waterAdjacent;
        })
    }

    const addColorsByCivilization = () => {

        const overlays = this.board.map.overlays;
        return (this.board.map.areas.map((area:Area)=>{
            const element = area.copy(true);
            element.setAttribute('civilization-color', '');
            element.style.fill = area.startingCivilization.color;
            overlays.appendChild(element);
            return element
        }))
    }

    const addStartingAreas = () => {
        const overlays = this.board.map.overlays;
        this.board.map.areas.forEach((area:Area)=>{
            if (area.isStartingArea) {
                const element = area.copy(false);
                element.setAttribute('starting-area', '');
                overlays.appendChild(element);
            }
        })

    }

    const initGUI = () => {
        this.gui.actionCard.hide();
        this.gui.actionCard.element.remove();
        this.gui.actionCard = SwitchUI.new('gui', 'actionCard');
        this.gui.info.element.setAttribute('info-center', '');
        const playerInfo = this.gui.actionCard.addNew(CardUI, 'playerInfo');

        const selectCivilizationUI = DropDownOptionRowUI.new('playerInfo', 'selectCivilization');
        selectCivilizationUI.key.text = 'civilization';
        selectCivilizationUI.options.push(...civilizations.map(civilization=>DropDownOptionUI.createNew('selectCivilizationSelect', civilization)));
        selectCivilizationUI.onSelect = (option) => {this.board.map.unColor('starting-civilization'); option.value==='defaultOption'? null: this.board.map.color((area)=>area.startingCivilization.name!==option.value? ['']: [], 'starting-civilization')};

        this.gui.actionCard.select('playerInfo');
        this.gui.actionCard.show();
        
    }

    const addHoverInfo = () => {

        this.board.map.hoverOn = ((area:Area)=>{this.gui.info.display = title(area.name)})
        this.board.map.hoverOff = ((area:Area)=>{this.gui.info.clear()})
    }

    await addCustomAreaData()
    addColorsByCivilization()
    addStartingAreas()
    initGUI()
    addHoverInfo()
}
