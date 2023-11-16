import { setHeader } from "../components/banner";
import { element, title } from "../utilities";
const civs = require('/web/json/civs.json').civs

export function startMapCreation(mapState) {
    setHeader('Map Creation');

    let areasData = [];

    function selectArea(event) {
        const left = document.getElementById('left');
        if (!mapState.selected) {
            return left.style.display = 'none';
        }
        const selectedName = mapState.selected.getAttribute('name');
        const editorHtml = element('div', '', 'header', title(selectedName)) + element('hr') + element('div', '', 'justifyBetween', element('div', '', '', 'civ') + element('select', 'creationSelect', '', ''));
        left.innerHTML = editorHtml;
        left.style.display = 'block';
        const select = document.getElementById('creationSelect');
        const civOption = (civ) =>  {
            const option = document.createElement('option');
            option.style.backgroundColor = civ.color;
            option.innerText = title(civ.name);
            option.value = civ.name;
            select.appendChild(option);
        };
        const noneOption = document.createElement('option');
        noneOption.innerText = 'None';
        noneOption.value = 'none';
        select.appendChild(noneOption);
        civs.forEach(civOption);
        select.style.backgroundColor = civs.filter(civ=>civ.name===select.value)[0]?.color;
        const changeSelect = (event) => {
            const name = mapState.selected.getAttribute('name');
            const color = civs.filter(civ=>civ.name===select.value)[0]?.color
            const overlay = document.querySelector(`path[name="${name}"][overlay]`);
            console.log(name);
            select.style.backgroundColor = color;
            overlay?.remove()
            if (color) {
                const overlayContainer = document.querySelector('g[name="overlay"]');
                const overlay = mapState.selected.cloneNode();
                const attrs = Object.values(overlay.attributes).filter(attr=>((attr.name!=='name')&&(attr.name!=="d")));
                attrs.forEach(attr=>overlay.removeAttribute(attr.name));
                overlay.setAttribute('fill', color);
                overlay.setAttribute('opacity', .5);
                overlay.setAttribute('overlay', '');
                overlayContainer.appendChild(overlay);
            };
        };
        select.addEventListener('change', changeSelect);
    };

    mapState.areasUI.forEach(ui => {
        ui.addEventListener('mouseup', selectArea);
    });
};