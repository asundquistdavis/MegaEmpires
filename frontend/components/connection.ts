import { User } from "../objects/user";

type Effect = (data:any)=>any|void

export class Connection {

    socket: WebSocket;
    listeners: Map<string, Effect>;
    id: string;

    static GlobalListeners = new Map([['default', ()=>{}]])

    static async create(user:User) {
        const userId = user.id;
        const address = 'ws://localhost:8000';
        const socket = new WebSocket(address);
        const connection  = new Connection(socket);
        connection.registerListener('connection', (data)=>{connection.id=data.connectionId})
        await new Promise<void>((response, reject)=>{
            socket.onopen = ()=>{
                connection.sendAction( {action: 'create'} );
                response();
            };
            socket.onerror = (error:Event)=>{
                console.log(error)
                response()
            };
        })
        socket.onmessage = (message:MessageEvent)=>{
            
            const data = JSON.parse(message.data);
            connection.receiveEvent(data)
        };
        return connection
    };

    constructor(socket:WebSocket) {
        this.socket = socket;
        this.listeners = Connection.GlobalListeners;
    };

    registerListener(event:string, effect:(data:any)=>any) {
        this.listeners.set(event, effect)
    };

    removeListener(event:string) {
        this.listeners.delete(event);
    };

    receiveEvent(data:any) {
        if (!data.event) {return}
        this.sendAction(this.listeners.get(data.event)?.(data)||this.listeners.get('default')(null));
    };

    sendAction(data:any) {
        data? this.socket.send(JSON.stringify(data)||JSON.stringify('')): null;
    };

};
