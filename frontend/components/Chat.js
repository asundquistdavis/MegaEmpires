import axios from "axios";
import { useModal } from "./modal";
import '../styles/chat.scss';

class Message {

    static new(text, isOwned, sender) {return new Message(text, isOwned, sender)};
    constructor(text, isOwned, sender) {
        this.text = text;
        this.isOwned = isOwned;
        this.sender = sender;
    }
}

export function useChat(rowId, name) {

    let chatState = false
    let messages = [Message.new('hello', true, 'Andrew'), Message.new('goodbye', false, 'Tom')];
    let text = '';

    const row = document.getElementById(rowId);
    const root = document.getElementById('root');
    const chatOpen = document.createElement('div');
    chatOpen.id = name+'ChatOpen'
    chatOpen.className = 'hoverable'
    const chatOpenHtml = '<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="var(--bg1)" class="bi bi-chat-right-fill" viewBox="0 0 16 16"><path d="M14 0a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z"/></svg>';
    chatOpen.innerHTML = chatOpenHtml;
    const chat = document.createElement('div');
    chat.id = name+'Chat';
    root.appendChild(chat);
    const [openChat, _, messageBody] = useModal(name+'chat' ,name+'Chat', '', chatState);
    messageBody.className += ' messageBody'
    chatOpen.addEventListener('click', openChat);
    row.appendChild(chatOpen);
    const messagesContainer = document.createElement('div');
    messagesContainer.id = name + 'MessagesContainer';
    messagesContainer.className = 'messagesContainer';
    const messagesInputRow = document.createElement('div');
    messagesInputRow.id = name + 'MessagesInputRow';
    messagesInputRow.className = 'messagesInputRow';
    messagesInputRow.innerHTML = `<input id="${name+'MessageInput'}" class="messageInput" value=""/><button id="${name+'ChatButton'}" class="chatButton">Send</button>`
    messageBody.appendChild(messagesContainer);
    messageBody.appendChild(document.createElement('hr'))
    messageBody.appendChild(messagesInputRow);
    document.getElementById(name+'MessageInput').addEventListener('change', handleTyping)
    document.getElementById(name+'ChatButton').addEventListener('click', sendMessage)

    function getMessages() {
        
    };

    function drawMessages() {
        const messageHtml = (message) => `<div class="messageOutside ${message.isOwned? 'owned': ''}"><div class="messageSender">${message.isOwned? '': message.sender}</div><div class="messageBubble"><div class="messageText">${message.text}</div></div></div>`;
        const messagesHtml = messages.map(messageHtml).join('');
        messagesContainer.innerHTML = messagesHtml;
    };

    function handleTyping(event) {
        text = event.target.value;
        document.getElementById(name+'MessageInput').value = text;
    }

    function sendMessage() {
        messages.push(Message.new(text, true, 'Andrew'));
        console.log(messages);
        drawMessages();
        text = '';
        document.getElementById(name+'MessageInput').value = text;
    }

    drawMessages();

};


