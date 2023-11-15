import axios from "axios";
import { title } from "../utilities";
import { setBanner } from "../components/banner";

export function startExpansion(mapState) {

    const controller = new AbortController();

    // clean up code
    const endPhase = () => {
        // clear left div
        document.getElementById('left').style.display = 'none';
        document.getElementById('left').innerHTML = null;
        // abort listeners
        controller.abort();
    };

    // add select on click to all areas
    mapState.areasUI.forEach(areaUI=>{
        areaUI.addEventListener('mouseup', selectArea, {signal: controller.signal});
    });
    // set phase banner
    setBanner('start of turn');
    // update players card
    playersCard();
        
    function playersCard() {
        const playersHtml = `
            <div class="header">Players</div>
            <hr>
            <div class="player">Andrew</div>
            <div class="player">Tom</div>
        `;
        const players = document.getElementById('players');
        players.innerHTML = playersHtml;
        players.style.display = 'block';
    };

    const popExpCard = (area) => {
        const {name, population, support} = area
        return (
            `<div>
            <div class="header">${title(name)}</div>
            <hr/>
            <div>Population: ${population}</div>
            <div>Support Limit: ${support}</div>
            <svg id="popExpCardUp" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 16a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2zm6.5-4.5V5.707l2.146 2.147a.5.5 0 0 0 .708-.708l-3-3a.5.5 0 0 0-.708 0l-3 3a.5.5 0 1 0 .708.708L7.5 5.707V11.5a.5.5 0 0 0 1 0z"/>
            </svg>
            <svg id="popExpCardDown" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.5 4.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 1 1 .708-.708L7.5 10.293V4.5a.5.5 0 0 1 1 0z"/>
            </svg>
            </div>`
        );
    };
        
    function selectArea() {
        // show left
        // set left to be pop exp card for selected area
        if (!mapState.selected) {
            return document.getElementById('left').style.display = 'none';
        }
        const [area] = mapState.areasData.filter(data=>data.name===mapState.selected.getAttribute('name'));
        document.getElementById('left').innerHTML = popExpCard(area);
        document.getElementById('left').style.display = 'block';
        const increment = () => {area.population=area.population+1; selectArea()}
        const decrement = () => {area.population=area.population-1; selectArea()}
        document.getElementById('popExpCardUp').addEventListener('click', increment)
        document.getElementById('popExpCardDown').addEventListener('click', decrement)
    };

};
