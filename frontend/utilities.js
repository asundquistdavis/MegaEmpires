
const endpoint = (route) => `http://23.88.147.138:1104/${route}`
const axiosCorsConfig = {headers: {"Content-Type": "application/json"}};
const useServer = false

export const capatalize = (string) => string[0].toUpperCase() + string.slice(1);

export const title = (string) => string.split(' ').map(capatalize).join(' ');

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
            response.data.status? errorSetter(response.data.status): setter(response.data.data);
        });
    } else {setter(fallback)};
};