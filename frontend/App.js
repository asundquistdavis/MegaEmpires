import React, { useEffect, useState } from "react";
import '/frontend/styles/reset.scss'
import '/frontend/styles/main.scss'
import PlayGame from "./Pages/PlayGame";
import Auth from "./Pages/Auth";
import PreGame from "./Pages/PreGame";
import MapCreater from "./Pages/MapCreater";
import ChooseGame from "./Pages/ChooseGame";
import Base from "./components/Base";
import axios from "axios";

const NewPage = () => {
    return <>
        New Game
    </>
};

class AppState {

    static new = new AppState(NewPage);
    static auth = new AppState(Auth);
    static mapCreater = new AppState(MapCreater);
    static chooseGame = new AppState(ChooseGame);
    static preGame = new AppState(PreGame);
    static playeGame = new AppState(PlayGame);

    constructor(page) {
        this.page = page;
    };
};

const App = () => {

    const [appState, setAppState] = useState(appState.new)

    // const [res, setRes] = useState('');

    // useEffect(() => {axios.get('/', {params: {token: 'hello world'}})
    //     .then(r=>setRes(r.data))}
    //     , [])
    
    // const [appState, setAppState] = useState(AppState.new);

    return <>
        <Base>
            {appState.page()}
        </Base>
    </>;
};

export default App;
