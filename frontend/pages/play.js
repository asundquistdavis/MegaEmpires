import axios from "axios";
import { useMap } from "../map";
import { startExpansion } from "../phases/expansion";
import '/frontend/reset.scss';
import { setBanner, setHeader } from "../components/banner";
import { useModal } from "../components/modal";
import { useSettings } from "../components/settings";
import { useChat } from "../components/chat";
import { startMapCreation } from "../phases/mapCreation";

// create public state 
const mapState = {
    clicking: false,
    moving: false,
    scale: 1,
    selected: null,
    hovered: null,
    areasUI: [],
    areasData: [],
}

// main function
async function play() {
    setHeader('Loading...');
    // load UI
    useUI();
    // load map event listeners
    await useMap(mapState);
    //start expansion phase
    // startExpansion(mapState);
    startMapCreation(mapState);
}

function useUI() {

    const root = document.getElementById('root');
    const utilityRow = document.createElement('div');
    utilityRow.id = 'utilityRow';
    utilityRow.className = 'overboard buttonRow'
    utilityRow.style.top = 'calc(2*var(--length1))'
    utilityRow.style.right = 'calc(2*var(--length1))'
    root.appendChild(utilityRow)

    useSettings('utilityRow');
    useChat('utilityRow', '');
};


play()