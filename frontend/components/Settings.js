import React from "react";
import Modal from "./Modal";
import Button from "./Button";
import '/frontend/styles/settings.scss'

const Settings = (pageState) => {

    const {user} = pageState;
    const exit = () => pageState.setPageState(state=>({...state, showSettings: !state.showSettings}));
    const handleLogout = () => {
        localStorage.removeItem('token')
        pageState.setAppState(state=>({
            name: null,
            token: null,
            pageState: null,
            setState: null,
            error: 0,
            render: ()=><></>,
            user: null,
            game: null,
        }));
    };

    const gameRow = pageState.game? <div className="settingsGameRow">
        <div className="settingsGameHost">Veiwing {pageState.game? pageState.game.hostUsername: null}'s Game</div>
        <div className="settingsGameStatus"> in {pageState.game? pageState.game.status: null}</div>
        <Button onClick>Leave</Button>
        <Button onClick>Back</Button>
    </div>: null

    return <>
        <Modal title='Settings' exit={exit}>
            <div className="settingsUserRow">
                <div>User: {user.username}</div>
                <Button className="cc-alert" width={15} height={15} onClick={handleLogout}>Logout</Button>
            </div>
            {gameRow}
        </Modal>
    </>;
};

export default Settings;
