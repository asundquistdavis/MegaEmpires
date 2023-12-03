

export class User {

    id:string;

    static new() {
        const user = new User()
        return user;
    };

    constructor() {
        this.id = '1';
    }
};

