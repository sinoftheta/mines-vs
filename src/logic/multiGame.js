import State from '@/logic/state';
import Board from '@/logic/board';
import Peer from 'peerjs';

//https://glitch.com/edit/#!/peerjs-video?path=public%2Fmain.js%3A1%3A0

export default class MultiGame{
    constructor(boardRef, height, width, mines, userId, peerId, onIdGenerate){


        this.seed = userId + peerId;

        this.state = new State(height, width, mines, this.seed);
        this.board = new Board(boardRef, this.state, 30);
        //this.onIdGenerate = onIdGenerate;

        // Register with the peer server
        this.peer = new Peer({
            host: 'localhost',
            port: '8082',
            path: '/direct'
        });
        this.peer.on('open', (id) => {
            console.log('connect code:', id);
            onIdGenerate(id);
        });
        this.peer.on('error', (error) => {
            console.error(error);
        });

        // Handle incoming data connection
        this.peer.on('connection', (conn) => {

            console.log('incoming peer connection!');

            conn.on('data', (data) => {
                console.log(`received: ${data}`);
            });

            conn.on('open', () => {
                conn.send('hello!');
            });
        });



    }
    set opponentCode(code){
        this.connectId = code;
        console.log(`Connecting to ${code}...`);

        this.conn = this.peer.connect(code);
        this.conn.on('data', (data) => {
            console.log(`received: ${data}`);
        });
        this.conn.on('open', () => {
            this.conn.send('hi!');
        });
    }
    
}