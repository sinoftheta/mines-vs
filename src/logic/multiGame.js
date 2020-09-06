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
const handshake = 'handshake'; //connection established
const settings = 'settings';  //settings transmitted
const standby = 'standby'; // waiting for players to be ready
const start = 'start'; //signal countdown timer to begin
const click = 'click';
const realign = 'realign'; //contains a list of tile coords

const countdownTime = 2000; // in ms
// client states


export default class MultiGame{
    constructor(
        boardRef, 
        height, 
        width, 
        mines,
        onIdGenerate, //callback to display users connect code once it has been generated
        startCountDown // returns a promise after countdown has started
        ){

        // save stuff
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.boardRef = boardRef;
        this.boardState = new State(height, width, mines, 69, false);
        this.board = new Board(boardRef, this.boardState, 30, false);

        //this.onIdGenerate = onIdGenerate;
        this.startCountDown = startCountDown;

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

            conn.on('data', (data) => this.clientSwitch(data, conn));
        });
    }
    set opponentCode(code){
        // start connection as host
        this.connectId = code;
        this.host = true;
        console.log(`Connecting to ${code}... you are host!`); 
        this.conn = this.peer.connect(code);
        //this.conn.on('open', () => {});

        this.conn.on('data', (data) => this.hostSwitch(data));

    }
    hostSwitch(data){
        console.log(data, 'tx time:', Date.now() - data.ts);
        switch(data.type){
            case handshake:
                //init seed (& other settings)
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
            case standby:
                this.hostReady = false;
                this.clientReady = false;
                this.setBoardSync();
                this.conn.send({
                    ts: Date.now(),
                    type: start
                })
                this.startCountDown(countdownTime) //.then(startgame);

                


        }
    }
    clientSwitch(data, conn){
        console.log(data, 'tx time:', Date.now() - data.ts);
        switch(data.type){
            case settings:
                //sync states
                this.seed = data.seed;
                this.height = data.height;
                this.width = data.width;
                this.mines = data.mines;
                this.setBoardSync();
                conn.send({type: standby, ts: Date.now()});
                break;
            case start:
                this.startCountDown(countdownTime - (Date.now() - data.ts)) //.then(startgame);

        }
    }
    setBoardSync(){
        //resets the board with a syncronised state
        this.boardState = new State(this.height, this.width, this.mines, this.seed, true);
        this.board = new Board(this.boardRef, this.boardState, 30, true);
    }

    
}