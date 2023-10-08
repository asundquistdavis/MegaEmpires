import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import { XCircleFill } from "react-bootstrap-icons";
import '/frontend/styles/settings.scss'

const Settings = (pageState) => {

    const {user} = pageState;
    const exit = () => pageState.setter(state=>({...state, pageState: {...state.pageState, showSettings: !state.pageState.showSettings}}));
    const handleLogout = () => pageState.setter(state=>({...state, token: null}));

    return <>
        <Modal title='Settings' exit={exit}>
            <div className="settingsUserRow">
                <Button className="cc-alert" width={15} height={15} onClick={handleLogout}>Logout</Button>
                <div>User: {user.username}</div>
            </div>
        </Modal>
    </>;
};

export default Settings;
