import React from "react";
import '/frontend/styles/modal.scss'
import Header from "./Header";
import { XCircleFill } from "react-bootstrap-icons";
import Button from "./Button";

const Modal = (props) => {
    const {children, title, exit} = props;
    return <>
        <div className="modalOverlay">
            <div className="modalBody">
                <Header right={<Button Icon={XCircleFill} onClick={exit}/>} >{title}</Header>
                {children}
            </div>
        </div>
    </>
};

export default Modal;
