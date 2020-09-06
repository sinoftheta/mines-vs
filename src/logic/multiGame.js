import State from '@/logic/state';
import Board from '@/logic/board';
import Peer from 'peerjs';

//https://glitch.com/edit/#!/peerjs-video?path=public%2Fmain.js%3A1%3A0

// connection states?
/*const noConnection = 'noConnection';
const handshake    = 'handshake';
const standby      = 'standby';
const ready        = 'ready';
const gameplay     = 'gameplay';
const postgame     = 'postgame';
*/

// transmission types:
const handshake = 'handshake';
const settings = 'settings'; 
const settings_received = 'sr';
const ready = 'ready'; //contains nothing
const click = 'click'; // contains a tile coordinate
const realign = 'realign'; //contains a list of tile coords

// client states


export default class MultiGame{
    constructor(boardRef, height, width, mines, onIdGenerate){

        this.height = height;
        this.width = width;
        this.mines = mines;
        this.boardRef = boardRef;
        this.boardState = new State(height, width, mines, 69, false);
        this.board = new Board(boardRef, this.boardState, 30, false);
        //this.onIdGenerate = onIdGenerate;

        // Register with the peer server
        this.peer = new Peer({
            host: 'localhost',
            port: '8082',
            path: '/direct'
        });
        this.peer.on('open', (id) => {
            console.log('generated connection code:', id);
            if(onIdGenerate) onIdGenerate(id);
        });
        this.peer.on('error', (error) => {
            console.error(error);
        });

        // Handle incoming data connection
        this.peer.on('connection', (conn) => {
            // start connection as client

            console.log('incoming peer connection, you are client!');

            // host will update its state upon sending data
            this.host = false;

            conn.on('open', () => {conn.send({type: handshake, ts: Date.now()});});

            conn.on('data', (data) => {
                console.log(`received from host:`, data);
                this.clientSwitch(data, conn);
            });


        });



    }
    set opponentCode(code){
        // start connection as host

        this.connectId = code;
        console.log(`Connecting to ${code}... you are host!`);
        this.host = true;
        this.conn = this.peer.connect(code);

        //this.conn.on('open', () => {});

        this.conn.on('data', (data) => {
            console.log(`received from client:`, data);
            this.hostSwitch(data);
        });

    }
    hostSwitch(data){
        switch(data.type){
            case handshake:
                //init seed (& other settings)
                console.log(`handshake received in ${Date.now() - data.ts}ms`);
                this.seed = Math.floor(Math.random() * 9007199254740991);
                this.conn.send({
                    ts: Date.now(),
                    type: settings,
                    seed: this.seed,
                    height: this.height,
                    width: this.width,
                    mines: this.mines
                });

                break;
            case settings_received:
                this.readyUser(); // then send ready
        }
    }
    clientSwitch(data, conn){
        switch(data.type){
            case settings:
                //sync states
                this.seed = data.seed;
                this.height = data.height;
                this.width = data.width;
                this.mines = data.mines;
                console.log(`settings received in: ${Date.now() - data.ts}ms`);
                conn.send({type: settings_received});
                this.readyUser();
                break;
        }
    }
    readyUser(){
        //prompt user for ready
        this.boardState = new State(this.height, this.width, this.mines, this.seed, true);
        this.board = new Board(this.boardRef, this.boardState, 30, true);
        console.log('ready?');
    }

    
}