import { title } from "../utilities";

export function useModal(name, parentId, bodyHtml='', state=false) {
    const parent = document.getElementById(parentId);
    const modalHtml = `<div id="${name+'Modal'}" class="modal">`;
    const modalContentHtml = `<div id="${name+'ModalContent'}" class="card modalContent"></div>`;
    const modalHeaderHtml = `<div class="justifyBetween"><div></div><div class="header">${title(name)}</div><div id=${name+'ModalClose'} class="hoverableX"><svg xmlns="http://www.w3.org/2000/svg" stroke-width="2px" width="20" height="20" fill="var(--bg1)" class="bi bi-x-circle-fill" viewBox="0 0 16 16">
    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"/>
  </svg></div></div>`
    const openModal = (event) => {document.getElementById(name+'Modal').style.display = 'block'; state=!state};
    const closeModal = (event) => {document.getElementById(name+'Modal').style.display = 'none'; state=!state};
    const body = document.createElement('div')
    body.id = name + 'Body'
    parent.innerHTML = modalHtml;
    body.innerHTML = bodyHtml;
    document.getElementById(name+'Modal').innerHTML = modalContentHtml
    document.getElementById(name+'ModalContent').innerHTML = modalHeaderHtml
    document.getElementById(name+'ModalClose').addEventListener('click', closeModal);
    document.getElementById(name+'ModalContent').appendChild(document.createElement('hr'))
    document.getElementById(name+'ModalContent').appendChild(body)
    return [openModal, closeModal, body];
};