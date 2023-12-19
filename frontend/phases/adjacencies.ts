import { ButtonUI } from "../components/button";
import { CardUI } from "../components/card";
import { Client } from "../components/client"
import { SelectionBox } from "../components/selectionBox";
import { SwitchUI } from "../components/switch";
import { Area, AreaLike, Support } from "../objects/area"
import { ElementUI, title, toCamel } from "../utilities";
import '../styles/adjacencies.scss';
import { CheckBoxRowUI, DropDownOptionRowUI, DropDownOptionUI, TextInputRowUI } from "../components/settingRow";
import axios from "axios";

export type CustomAreaData = {
    name: string,
    isOpenSea: boolean,
    landAdjacent: string[],
    waterAdjacent: string[],
    startingCivilization: {name:string, color:string},
    isStartingArea: boolean,
    hasCity: boolean,
    isOnFloodplain: boolean,
    hasFloodplainCity: boolean,
    support: number,
    isOnVolcano: boolean,
}

export async function adjacencies(this:Client) {
    
    type Layer = {name:string, element:SVGElement, water:Boolean};
    
    const overlay =  document.querySelector('g[name="overlay"]');
    
    const civs:{name:string, color:string}[] = (await axios.get('./json/civs.json')).data.civs;

    let currentCiv = civs[0]

    const newArea: (area:Area)=>CustomAreaData = (area:Area) => {
        return {
            name: area.name,
            isOpenSea: area.type==='water',
            landAdjacent: [],
            waterAdjacent: [],
            startingCivilization: {name:currentCiv.name, color:currentCiv.color},
            isStartingArea: false,
            hasCity: !!area?.city,
            isOnFloodplain: false,
            hasFloodplainCity: !!area.city?.element?.getAttribute('floodplaincity'),
            support: area?.support?.value||0,
            isOnVolcano: false,
        };
    };
        
    const getArea: ()=>void = () => {
        const name = this.board.map.selected.name;
        this.connection.sendAction({action: 'get', name})
    };
    
    const editArea = (name:string, area:any) => {
        if (!name) {return}
        this.connection.sendAction({action: 'edit', name, area})
    };

    const flipAdjacency = (name:string, target:string, water:boolean=false) => {
        if (!name) {return}
        this.connection.sendAction({action: water? 'flipWater': 'flipLand', name, target})
    };

    this.connection.registerListener('new', data=>{   
        const selected = this.board.map.selected
        const area = newArea(selected as Area);
        editArea(area.name, area);
    })

    this.connection.registerListener('area', data=>{
        unselectArea();
        selectArea(data.area);
    });

    const layers:Array<Layer> = [];

    this.gui.actionCard.element.remove();
    this.gui.actionCard = SwitchUI.new(this.gui.element.id, 'actionCard') as SwitchUI;
    const actionCard = (this.gui.actionCard as SwitchUI);
    const selectAreaUI = actionCard.addNew(CardUI, 'selectArea');
    const editAreaUI = actionCard.addNew(CardUI, 'editArea');

    selectAreaUI.header.title = 'Select an Area';
    const dropButtonUI = ButtonUI.new('selectArea', 'dropButton');
    dropButtonUI.onClick = () => this.connection.sendAction({action:'drop',confirm:''});
    dropButtonUI.text = 'Drop';
    dropButtonUI.disabled = false;
    const submitButtonUI = ButtonUI.new('selectArea', 'submitButton');
    submitButtonUI.text = 'Submit';
    submitButtonUI.onClick = () => this.connection.sendAction({action:'submit'});

    // edit area
    const hasCityUI = CheckBoxRowUI.new(editAreaUI.content.element.id, 'hasCity');
    hasCityUI.key.text = 'Has City';
    hasCityUI.onClick = (truth) => {
        const name = this.board.map.selected.name;
        editArea(name, {hasCity: !truth})
        return false
    };
    const isOnFloodplainUI = CheckBoxRowUI.new(editAreaUI.content.element.id, 'isOnFloodplain');
    isOnFloodplainUI.key.text = 'On Floodplain';
    isOnFloodplainUI.onClick = (truth) => {
        const name = this.board.map.selected.name;
        editArea(name, {isOnFloodplain: !truth})
        return false
    };
    const hasFloodplainCityUI = CheckBoxRowUI.new(editAreaUI.content.element.id, 'hasFloodplainCity');
    hasFloodplainCityUI.key.text = 'Is Floodplain City';
    hasFloodplainCityUI.onClick = (truth) => {
        const name = this.board.map.selected.name;
        editArea(name, {hasFloodplainCity: !truth})
        return false
    };
    const isOnVolcanoUI = CheckBoxRowUI.new(editAreaUI.content.element.id, 'isOnVolcano');
    isOnVolcanoUI.key.text = 'On Volcano';
    isOnVolcanoUI.onClick = (truth) => {
        const name = this.board.map.selected.name;
        editArea(name, {isOnVolcano: !truth})
        return false
    };
    const supportUI = TextInputRowUI.new(editAreaUI.content.element.id, 'support');
    supportUI.key.text = 'Support';
    supportUI.value.type = 'number';
    supportUI.onChange = (value:string) => {
        const name = this.board.map.selected.name;
        editArea(name, {support: parseInt(value)})
    }
    const isStartingAreaUI = CheckBoxRowUI.new(editAreaUI.content.id, 'isStartingArea');
    isStartingAreaUI.key.text = 'Starting Area';
    isStartingAreaUI.onClick = (truth) => {
        const name = this.board.map.selected.name;
        editArea(name, {isStartingArea: !truth})
        return false
    }
    const startingCivilizationUI = DropDownOptionRowUI.new(editAreaUI.content.element.id, 'startingCivilization');
    startingCivilizationUI.key.text = 'Starting Civilization';
    startingCivilizationUI.options = civs.map((civ:{name:string, color:string})=>DropDownOptionUI.createNew(startingCivilizationUI.value.element.id, civ));
    startingCivilizationUI.onSelect = (option) => {
        currentCiv = civs.find(civ=>civ.name===option.value); 
        const name = this.board.map.selected.name;
        editArea(name, {startingCivilization: currentCiv});
    };
    const landAdjacentUI = SelectionBox.new(editAreaUI.content.element.id, 'landAdjacent');
    landAdjacentUI.title = 'Adjacent By Land';
    const waterAdjacentUI = SelectionBox.new(editAreaUI.content.element.id, 'waterAdjacent');
    waterAdjacentUI.title = 'Adjacent By Water';
    const isOpenSeaUI = CheckBoxRowUI.new(editAreaUI.content.element.id, 'isOpenSea');
    isOpenSeaUI.key.text = 'Is open Sea';
    isOpenSeaUI.onClick = (truth) => {
        const name = this.board.map.selected.name;
        editArea(name, {isOpenSea: !truth})
        return false;
    }
    const resetButton = ButtonUI.new(editAreaUI.content.element.id, 'resetButton');
    resetButton.text = 'Reset';
    resetButton.onClick = () => {this.connection.sendAction({action: 'reset', name: this.board.map.selected.name})}

    this.gui.info = CardUI.new(this.gui.element.id, 'infoCard');
    this.board.map.hoverOn = (area) => {this.gui.info.display = title(area.name)};
    this.board.map.hoverOff = () => {this.gui.info.clear()};

    this.gui.actionCard.select('selectArea');

    selectAreaUI.show();

    const selectArea = (areaData:CustomAreaData) => {
        editAreaUI.header.title = title(areaData.name);
        hasCityUI.value = areaData.hasCity;
        isOnFloodplainUI.value = areaData.isOnFloodplain;
        hasFloodplainCityUI.value = areaData.hasFloodplainCity;
        isOnVolcanoUI.value = areaData.isOnVolcano;
        supportUI.value.value = areaData.support.toString();
        const civilization = startingCivilizationUI.options.find(civ=>civ.value===areaData.startingCivilization.name)
        startingCivilizationUI.select(civilization);
        isOpenSeaUI.value = areaData.isOpenSea||false;
        isStartingAreaUI.value = areaData.isStartingArea;
        displayAllAdjacencies(areaData);
    };

    const unselectArea = () => {
        editAreaUI.header.title = '';
        hasCityUI.value = false;
        isOnFloodplainUI.value = false;
        hasFloodplainCityUI.value = false;
        isOnVolcanoUI.value = false;
        supportUI.value.value = '';
        const civilization = startingCivilizationUI.defaultOption;
        startingCivilizationUI.select(civilization);
        isOpenSeaUI.value = false;
        isStartingAreaUI.value = false;
        clearAllAdjacencies();
    }

    const toggleAdjacency = (area:AreaLike, water:boolean=false) => {
        const name = this.board.map.selected.name;
        flipAdjacency(name, area.name, water);
    };

    const displayAllAdjacencies = (areaData:CustomAreaData) => {
        areaData.landAdjacent.forEach(landAdjacent=>{
            landAdjacentUI.addOption(()=>{}, title(landAdjacent), toCamel(landAdjacent));
            const element = this.board.map.get(landAdjacent).copy(true);
            element.setAttribute('softLight', '');
            overlay.appendChild(element);
            layers.push({name:landAdjacent, element, water: false});
        });
        areaData.waterAdjacent.forEach(waterAdjacent=>{
            waterAdjacentUI.addOption(()=>{}, title(waterAdjacent), toCamel(waterAdjacent));
            const element = this.board.map.get(waterAdjacent).copy(false);
            element.setAttribute('softLight', '');
            element.setAttribute('coastalSoftLight', '');
            overlay.appendChild(element);
            layers.push({name:waterAdjacent, element, water: true});
        });
    };

    const clearAllAdjacencies = () => {
        layers.filter(layer=>{layer.element.remove(); return false});
        landAdjacentUI.removeAllOptions()
        waterAdjacentUI.removeAllOptions()
    };

    this.board.map.clickAll = (area:AreaLike) => {
        const selected = this.board.map.selected;
        if (!selected) {
            actionCard.select('selectArea');
            unselectArea();
        };
        if (selected===area) {
            actionCard.select('editArea');
            getArea();
        };
    };

    this.board.map.clickSingle = (area:Area) => {
        const selected = this.board.map.selected;
        if ((area===selected)||!selected) {return}
        toggleAdjacency(area);
    };

    this.board.map.clickDouble = (area:Area) => {
        const selected = this.board.map.selected;
        if ((area===selected)||!selected) {return}
        toggleAdjacency(area, true);
    };

    this.board.map.selectable = (area:Area) => {
        const selected = this.board.map.selected;
        if (!selected) {return true};
        if (area === selected) {return true};
        return false;
    };

    this.board.map.openSeaListeners = true;

};
