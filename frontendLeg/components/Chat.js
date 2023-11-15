import React from "react";
import Button from "./Button";
import '/frontend/styles/chat.scss'

const Chat = () => {

    return <div className="chatBorder">
        <div className="chatMessages">
            <div className="chatMessageWrapper message">
                test
                <div className="chatMessageBubble">
                    Hi. I'm Excited to play!
                </div>
            </div>
            <div className="chatMessageWrapper reply">
                <div className="chatMessageBubble">
                    Hi. I would like to me Iberia.
                </div>
            </div>
        </div>
        <div className="chatSendMessageRow">
            <input type='text' placeholder="Message"/>
            <Button>Send</Button>
        </div>
    </div>
};

export default Chat;
