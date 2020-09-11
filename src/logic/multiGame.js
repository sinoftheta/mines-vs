import State from '@/logic/state';
import Board from '@/logic/board';
import Peer from 'peerjs';
import {p1, p2} from '@/logic/const.js';

//https://glitch.com/edit/#!/peerjs-video?path=public%2Fmain.js%3A1%3A0
// NOT WORKING ON LOCAL NETWORK FIX
//   https://github.com/peers/peerjs/issues/608#issuecomment-567045127

/**
 * TERMINOLOGY:
 * user = host = p1
 * 
 * opponent = client = p2
 * 
 * 
 */

// transmission types:
const handshake = 'handshake'; //connection established
const settings = 'settings';  //settings transmitted
const standby = 'standby'; // waiting for players to be ready
const start = 'start'; //signal countdown timer to begin
//=-=-=-=-=-=-=-=-//
const leftClick = 'lclick';
const flag = 'flag';
const chord = 'chord';
const ping = 'ping';
const realign = 'realign'; //contains a list of tile coords?

const pingInterval = 1000; // ms
const countdownTime = 100; // ms
// client states


export default class MultiGame{
    constructor(
        boardRef, 
        height, 
        width, 
        mines,
        px,
        onIdGenerate, //callback to display users connect code once it has been generated
        startCountDownUI // returns a promise after countdown has started
        ){

        // save stuff
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.boardRef = boardRef;
        this.px = px;
        this.boardState = new State(height, width, mines, 69, false);
        this.board = new Board(boardRef, this.boardState, px, false, false, () => {});

        //this.onIdGenerate = onIdGenerate;
        this.startCountDownUI = startCountDownUI;

        this.userPoints = 0;
        this.opponentPoints = 0;

        // Register with the peer server
        if(process.env.VUE_APP_USE_PUBLIC_PEERJS == 'true'){
            this.peer = new Peer({
                debug:  Number(process.env.VUE_APP_PEER_DEBUG_LEVEL)
            });
        }
        else{
            this.peer = new Peer({
                host: process.env.VUE_APP_PEER_SERVER,
                port: process.env.VUE_APP_PORT || 8081,
                path: '/',
                debug: Number(process.env.VUE_APP_PEER_DEBUG_LEVEL)
            });
        }

        
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
            this.conn = conn;
            this.host = false;
            this.player = p2;
            this.opponent = p1;
            this.conn.on('open', () => { 
                console.log('sending handshake'); 
                this.conn.send({type: handshake});

                // TODO: make pinging a debug option... tbh its kinda useless. maybe make it better somehow?
                // start pinging
                // this.handlePing(); 
            });
            this.conn.on('data', (data) => this.clientSwitch(data));
        });
    }
    set opponentCode(code){
        // start connection as host
        this.connectId = code;
        this.host = true;
        this.player = p1; 
        this.opponent = p2;
        console.log(`Connecting to ${code}... you are host!`); 
        this.conn = this.peer.connect(code);
        //this.conn.on('open', () => {});

        this.conn.on('data', (data) => this.hostSwitch(data));
    }
    hostSwitch(data){
        switch(data.type){
            case handshake:
                //init seed (& other settings)
                this.seed = Math.floor(Math.random() * 9007199254740991);
                this.conn.send({
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
                this.conn.send({type: start});
                this.startCountDownUI(countdownTime)
                setTimeout(() => {this.startGame();}, countdownTime);
                break;
            case leftClick:
                this.opponentLeftClick(data.x, data.y, data.gameTime);
                break;
            case flag:
                this.opponentFlag(data.x, data.y);
                break;
            case ping:
                this.handlePing();
                break;

        }
    }
    clientSwitch(data){ // break into init sequence & gameplay switches?
        switch(data.type){
            case settings:
                //sync states
                this.seed = data.seed;
                this.height = data.height;
                this.width = data.width;
                this.mines = data.mines;
                this.setBoardSync();
                this.conn.send({type: standby});
                break;
            case start:
                const adjustedCountTime = countdownTime; // - prevrtt / 2 
                this.startCountDownUI(adjustedCountTime) 
                setTimeout(() => {this.startGame();}, adjustedCountTime);
                break;
            case leftClick:
                this.opponentLeftClick(data.x, data.y, data.gameTime);
                break;
            case flag:
                this.opponentFlag(data.x, data.y);
                break;
            case ping:
                this.handlePing();
                break;


        }
    }
    handlePing(){
        if(this.prevPingTs){
            console.log(`rtt: ` + `%c${(Date.now() - this.prevPingTs - 2 * pingInterval)}` + `%cms`, 'color:green', 'color: white');
        }
        setTimeout(() => this.conn.send({type: ping}), pingInterval);
        this.prevPingTs = Date.now();
    }
    setBoardSync(){
        //resets the board with a syncronised state
        this.boardState = new State(this.height, this.width, this.mines, this.seed, true);
        this.board = new Board(
            this.boardRef, 
            this.boardState, 
            this.px, 
            true, // real flag
            true, // multiplayer flag
            (x,y) => {this.userLeftClick(x,y);},
            (x,y) => {this.userFlag(x,y);}
            /* chording */
            );
    }
    startGame(){// also do more?
        console.log('go!');
        this.gameStartTime = Date.now();
        this.gameActive = true;
    }
    userLeftClick(x,y){
        //if(!this.gameActive) return;
        const gameTime = Date.now() - this.gameStartTime;
        //console.log('SENDING TS:', gameTime);
        const points = this.boardState.revealPoints(x,y, this.player);
        this.conn.send({
            type: leftClick,
            x,
            y,
            gameTime
        });
        console.log(`you scored: ${points}, your total: ${this.userPoints += points}`);

        if(this.boardState.clear){
            // game won
            console.log('game over!');
            return;
        }
    }
    opponentLeftClick(x,y, gameTime){
        // check for overlap. i.e. if need to rollback
        // send overlap command if needed


        // create a dictionary with x,y as the key, and the timestamp & owner & point value of click as the value
        /*let hub = {
            _1_2: {ts: 123, owner: 'host', points: 12}
        }*/
        // with an earlier timestamp, we reclaim all the tiles and the points that were earned with that click
        // if the opponent click has a later timestamp, ignore it. your click will be sent to the opponent and they will sync
        // store list of all moves in list, search list from end to be efficent?
        //update board

        // before the game starts, each tile will be randomly assigned a "player point priority." 
        // This value will determine the ownership of a click in the event of a tie.
        // if we receive an opponent click that has already been executed on the board, we look to the "player point priority" value
        // of the tile

        const now = Date.now();
        console.log(`opponent click at: ${gameTime}, current gameTime: ${now - this.gameStartTime}, diff: ${now - this.gameStartTime - gameTime}`)
        const points = this.boardState.revealPoints(x,y, this.opponent);
        this.board.drawAll();
        this.board.highlightCur();

        if(this.boardState.clear){
            // game won
            console.log('game over!');
            return;
        }
    }

    userFlag(x,y){
        console.log('user flagging')
        const target = this.boardState.board[x][y];

        if(target.revealed) return;
        // if tile is empty
            // flag it with user ownership
        // if tile is flagged
            // unflag regardless of ownership

        target.flagged = !target.flagged;
        target.owner = target.flagged? this.player : null;
        
        this.conn.send({type: flag,x,y});
    }
    opponentFlag(x,y){
        console.log('opponent flagging')
        const target = this.boardState.board[x][y];

        if(target.revealed) return;
        // tile is empty and covered
            // flag it with opponent ownership
        // tile is flagged
            // unflag regardless of ownership
        
        target.flagged = !target.flagged;
        target.owner = target.flagged? this.opponent : null;
        

        this.board.drawAll();
        this.board.highlightCur();

    }
    revokeClick(){
        // change ownership of click due to a tie
        // this includes points earned from the click, and all other tiles revealed from the click in the event of a 0.
    }
    revokeChord(){
        // revokes the ownership of a chord input...
        //
    }
}



// opponents cant remove your flags, at the end you're peanalized for incorrect flags.
// this changes the end condition for multiplayer
// correctly placed flags award no additional points

// OR

// slight penalty upon placing an incorrect flag