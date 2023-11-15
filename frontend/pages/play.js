import axios from "axios";
import { useMap } from "../map";
import { startExpansion } from "../phases/expansion";
import '/frontend/reset.scss';
import { setBanner } from "../components/banner";
import { useModal } from "../components/modal";
import { useSettings } from "../components/settings";
import { useChat } from "../components/chat";

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
    // load UI
    useUI()
    // load map event listeners
    await useMap(mapState);
    //start expansion phase
    startExpansion(mapState);
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

    // const settingsOpen = document.getElementById('settingsOpen');
    // const settingsModal = document.getElementById('settingsModal');
    // const settingClose = document.getElementById('settingsClose');
    // const openSettings = (event) => {settingsModal.style.display = 'block'};
    // const closeSettings = (event) => {settingsModal.style.display = 'none'};
    // settingClose.addEventListener('click', closeSettings);
    // settingsOpen.addEventListener('click', openSettings);

    // const chatOpen = document.getElementById('chatOpen');
    // const chatModal = document.getElementById('chatModal');
    // const chatClose = document.getElementById('chatClose');
    // const openChat = (event) => {chatModal.style.display = 'block'};
    // const closeChat = (event) => {chatModal.style.display = 'none'};
    // chatClose.addEventListener('click', closeChat);
    // chatOpen.addEventListener('click', openChat);
};


play()