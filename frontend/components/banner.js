import { title } from '../utilities';

const phaseData = require('./phases.json');

export function setBanner(phaseName) {
    const banner = document.getElementById('banner');
    const phasesHTML = '<div class="phases">' + phaseData.map(data=>`<div class="phase ${phaseName===data.name?'current': ''}"><div>${title(data.name)}</div></div>`).join('')  + '</div>';
    banner.innerHTML = phasesHTML;
    banner.style.display = 'block';
};

export function setHeader(text) {
    const banner = document.getElementById('banner');
    const headerHtml = `<div class="header">${text}</div>`;
    banner.innerHTML = headerHtml;
    banner.style.display = 'block'
};
