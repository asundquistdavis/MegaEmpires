import '../styles/play.scss';
import { Client } from '../components/client';

// main function
async function play() {

    const client = await Client.create();
    client.adjacencies();

};

play();
