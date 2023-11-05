
import axios from "axios";

export const endpoint = (route) => `http://23.88.147.138:1104/${route}`
export const axiosCorsConfig = {headers: {"Content-Type": "application/json"}};
const useServer = false

export const capitalize = (string) => (string.length === 0)? '': string[0].toUpperCase() + string.slice(1);

export const title = (string) => string.split(' ').map(capitalize).join(' ');

// use to update data on app and before server sends response
export const useServerState = (state, setState, name, endpoint, data, config={headers: {"Content-Type": "application/json"}}) => {
    // 
    const setServerState = (propName, value) => {
        // set state locally
        setState(state=>({...state, [propName]: value}));
        // call server
        axios.post(endpoint, {...data, [propName]: value}, config)
        .then(console.log)
    }
    return state, setServerState
};

export const setServerState = (setter, errorSetter, route, apiData, fallback, config=axiosCorsConfig) => {
    if (useServer) {
        axios.post(endpoint(route), apiData, config)
        .then(response=>{
            response.data.status? errorSetter(response.data.status): setter(response.data.data)})
        .catch(console.log);
    } else {setter(fallback)};
};

export const pollServer = (rate, route, schemaSend, schemaRec, appState, setAppState) => {
    const interval = setInterval(()=>{
        axios.post(endpoint(route), schemaSend(appState), axiosCorsConfig)
        .then()
        .catch()
    }, rate)
    return ()=>clearInterval(interval)
};