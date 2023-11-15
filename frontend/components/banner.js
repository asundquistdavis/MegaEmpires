import { title } from '../utilities';

const phaseData = require('./phases.json');

class Phase {

    constructor(name, actionGroups) {
        this.name = name;
        this.actionGroups;
    }
}

export function setBanner(phaseName) {
    const banner = document.getElementById('banner');
    const phasesHTML = '<div class="phases">' + phaseData.map(data=>`<div class="phase ${phaseName===data.name?'current': ''}"><div>${title(data.name)}</div></div>`).join('')  + '</div>';
    banner.innerHTML = phasesHTML;
    banner.style.display = 'block';
};

