
/* eslint-disable */

import State from '@/logic/state';
import BoardRender from '@/logic/boardRender';
import MouseHandler from '@/logic/mouseHandler';
import Peer from 'peerjs';
import {p1, p2, neither} from '@/logic/const.js';

//https://glitch.com/edit/#!/peerjs-video?path=public%2Fmain.js%3A1%3A0
// NOT WORKING ON LOCAL NETWORK FIX
//   https://github.com/peers/peerjs/issues/608#issuecomment-567045127



/**
 * TERMINOLOGY:
 * user = client = p2
 * 
 * opponent = host = p1
 * 
 * all operations are communitive, meaning the order in which they are applied to the board does not matter
 * both player states will resolve to the same final state as long as all inputs are received by both players.
 * 
 * is this turning into a god class?
 */

// transmission types:
const settings = 'settings';  //settings transmitted
const standby = 'standby'; // waiting for players to be ready
const start = 'start'; //signal countdown timer to begin
const readyNext = 'readyNext';
//=-=-=-=-=-=-=-=-//
const leftClick = 'lclick';
const flag = 'flag';
const chord = 'chord';
const ping = 'ping';

const pingInterval = 1000; // ms

export default class MultiGame{
    /**
     * Manager class for a versus game (both players compete on the same board)
     * @param {Element}  boardRef a reference to an html canvas that the board will be rendered on
     * @param {Number}   height height of the board
     * @param {Number}   width width of the board
     * @param {Number}   mines nimber of mines to be placed on the board
     * @param {Number}   px size of game tiles in pixels
     * @param {Function} onIdGenerate callback that is passed the clients id when it is received from the peerjs server
     * @param {Function} startCountDownUI callback that starts the countdown UI animation
     * @param {Number}   countdownTime // countdown time (in ms) between connection and game start
     * @param {Function} promptPlayAgain(Boolean win) callback that is executed when the game is finished
     */
    constructor(
        boardRef, 
        height, 
        width, 
        mines,
        px,
        onIdGenerate,
        startCountDownUI,
        countdownTime,
        promptPlayAgain,
        ){

        // save stuff
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.boardRef = boardRef;
        this.px = px;
        this.state = new State(height, width, mines, 69, false);
        this.render = new BoardRender(boardRef, this.state, px, false, false, () => {});
        this.mouseHandler = new MouseHandler(
            boardRef, 
            this.state, 
            this.render,
            () => {},
            () => {},
            () => {},
        );

        //this.onIdGenerate = onIdGenerate; // dont need to save this function as it is used in a lambda with onIdGenerate in scope anyway
        this.startCountDownUI = startCountDownUI;
        this.countdownTime = countdownTime;

        this.userPoints = 0;
        this.opponentPoints = 0;
        this.opponentReadyNext = false;
        this.xInit = 0;
        this.yInit = 0;

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
        this.peer.on('connection', (conn) => { // a bit of callback hell, refactor might be nice
            // start connection as host

            console.log('incoming peer connection, you are host!');
            this.conn = conn;
            this.host = true;
            this.player = p1;
            this.opponent = p2;
            this.conn.on('open', () => {
                
                console.log('sending settings to client'); 

                this.seed = Math.floor(Math.random() * 9007199254740991);
                this.conn.send({
                    type: settings,
                    seed: this.seed,
                    height: this.height,
                    width: this.width,
                    mines: this.mines
                });

                // TODO: make pinging a debug option... tbh its kinda useless. maybe make it better somehow?
                // start pinging
                // this.handlePing(); 
            });
            this.conn.on('data', (data) => this.hostSwitch(data));
        });

        // use opponent code if supplied
        //if(opponentConnectCode) this.opponentCode = opponentConnectCode;
    }
    set opponentCode(code){

        console.log('setting opponent code:', code);
        // start connection as host
        this.connectId = code;
        this.host = false;
        this.player = p2; 
        this.opponent = p1;
        console.log(`Connecting to ${code}... you are client!`); 
        this.conn = this.peer.connect(code);
        //this.conn.on('open', () => {});

        this.conn.on('data', (data) => this.clientSwitch(data));
    }
    hostSwitch(data){
        switch(data.type){
            case standby:
                this.setBoardSync();
                this.conn.send({type: start});
                // ***needs refactor with promise*** 
                this.startCountDownUI(this.countdownTime);
                this.multiplayerInit();
                setTimeout(() => {this.startGame();}, this.countdownTime);
                break;
            case leftClick:
                this.opponentLeftClick(data.x, data.y);
                break;
            case flag:
                this.opponentFlag(data.x, data.y);
                break;
            case chord:
                this.opponentChord(data.list);
                break;
            case ping:
                this.handlePing();
                break;
            case readyNext:
                this.opponentReadyNext = true;
                if(this.playerReadyNext){
                    // startGame with new seed
                }

        }
    }
    clientSwitch(data){
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
                const adjustedCountTime = this.countdownTime; // should be this but subtract the previous rtt/2
                // ***needs refactor with promise*** 
                this.startCountDownUI(adjustedCountTime);
                this.multiplayerInit();
                setTimeout(() => {this.startGame();}, adjustedCountTime);
                break;
            case leftClick:
                this.opponentLeftClick(data.x, data.y);
                break;
            case flag:
                this.opponentFlag(data.x, data.y);
                break;
            case chord:
                this.opponentChord(data.list);
                break;
            case ping:
                this.handlePing();
                break;
            case readyNext:
                this.opponentReadyNext = true;
                this.seed = data.seed;

                this.clientAttemptStart();
                

        }
    }
    clientReady(){
        this.playerReadyNext = true;
        this.conn.send({type: readyNext});
        this.clientAttemptStart();
    }
    clientAttemptStart(){
        if(this.playerReadyNext && this.opponentReadyNext){
            this.setBoardSync();
            this.conn.send({type: standby});
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

        console.log('playing as: ' + this.player);
        this.state = new State(this.height, this.width, this.mines, this.seed, true);
        this.render = new BoardRender(
            this.boardRef, 
            this.state, 
            this.px, 
            true, // real flag
            true, // multiplayer flag
        );
        this.mouseHandler = new MouseHandler(
            this.boardRef, 
            this.state, 
            this.render,
            (x,y) => { this.userLeftClick(x,y); },
            (x,y) => {      this.userFlag(x,y); },
            (x,y) => {     this.userChord(x,y); },
            (x,y) => { this._debugForceClick(x,y); },
        );
    }
    startGame(){// also do more?
        console.log('go!');
        this.gameStartTime = Date.now();
        this.gameActive = true;
        this.opponentReadyNext = false;

        // reveal inital zero, do not award points or owner
        this.state.revealPoints(this.xInit, this.yInit, neither, this.xInit, this.yInit);
        this.render.drawAll();
    }
    multiplayerInit(){

        // find coordinates near center
        // x and y are randomly selected from the center 20% of the board
        this.xInit = Math.floor(this.width * 0.5)  + (this.state.rng() > 0.5 ? 1 : -1) * Math.floor(this.width * 0.2);
        this.yInit = Math.floor(this.height * 0.5) + (this.state.rng() > 0.5 ? 1 : -1) * Math.floor(this.height * 0.2);

        console.log('init click ',this.xInit, ',',this.yInit)
        // force tile at coordinate to be a zero tile
        this.state.forceZeroAt(this.xInit,this.yInit);

        // calculate ppp
        this.state.placeIslandIds();
        this.state.placePpp();

    }
    userLeftClick(x,y){
        if(!this.gameActive || this.state.board[x][y].revealed) return; // dont send click signal if tile is revealed, owner irrelevant

        const points = this.state.revealPoints(x,y, this.player, x,y);

        this.conn.send({type: leftClick,x,y});

        console.log(`you scored: ${points}, your total: ${this.userPoints += points}`);

        this.checkForWinner();
    }
    opponentLeftClick(x,y){
        // before the game starts, each tile will be randomly assigned a "player point priority." 
        // This value will determine the ownership of a click in the event of a tie.
        // if we receive an opponent click on a tile that has already been uncovered on the board, we look to the "player point priority" value
        // of the tile to determine which player should own the tile

        const target = this.state.board[x][y];
        // if tile is revealed, look to the player point priority of the tile to determine if the opponent gets the tile, or if the click is ignored by the client
        if(target.revealed && target.ppp == this.opponent){
            console.log('opponent click overriding at:',x,y)
            const points = this.state.reclaimTiles(this.opponent, x,y);
        }
        else if(!target.revealed){
            console.log('opponent click at:',x,y);
            const points = this.state.revealPoints(x,y, this.opponent, x,y);
        }
        this.render.drawAll();
        this.render.highlight(this.mouseHandler.curX, this.mouseHandler.curY);

        this.checkForWinner();

    }
    checkForWinner(){
        // check win condition
        if(this.state.clear){
            const winner = this.state.winnerByArea;

            if(winner == this.player){
                console.log("you won!");
            }
            else if(winner == this.opponent){
                console.log("you lost!");
            }
            else {
                console.log("its a tie!");
            }


            // prompt for play again


        }
    }


    userFlag(x,y){
        console.log('user flagging')
        if(!this.gameActive) return;

        const target = this.state.board[x][y];

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
        const target = this.state.board[x][y];

        if(target.revealed) return;
        // tile is empty and covered
            // flag it with opponent ownership
        // tile is flagged
            // unflag regardless of ownership
        
        target.flagged = !target.flagged;
        target.owner   = target.flagged? this.opponent : null;
        

        this.render.drawAll();
        this.render.highlight(this.mouseHandler.curX, this.mouseHandler.curY);

    }
    userChord(i,j){
        console.log('chording');
        if(!this.gameActive) return;

        const {points, revealList} = this.resolveChord(i,j, this.player);
        this.conn.send({type: chord, list: revealList});

        this.render.drawAll();
        this.render.highlight(this.mouseHandler.curX, this.mouseHandler.curY);

        if(this.state.clear){
            // game won
            console.log('game over!');
            return;
        }
    }
    opponentChord(list){
        // BUG: need to resolve opponents chord as well...?

        console.log('opponent chording!', list);
        list.forEach(({x,y}) => this.opponentLeftClick(x,y));
    }
    /**
     * resolves a chord input on the tile at (i,j). Checks that the appropriate amount of flags are neighboring the click, and returns an array
     * of coordinates that were uncovered, along with the points awarded from the click.
     * @param {Number} i x coordinate of chord 
     * @param {Number} j y coordinate of chord
     * @param {String} owner the owner of the chord
     */
    resolveChord(i,j, owner){
        let points = 0;
        let revealList = [];
        let neighborFlagCount = 0;

        const choordTarg = this.state.board[i][j];
        if(!choordTarg.revealed || choordTarg.isMine) return {points, revealList};


        // count neighboring flags and save potential tile coordinates to reveal 
        this.state.neighbors(i,j).forEach( ({x,y}) => {
            const target = this.state.board[x][y];
            if(target.flagged && !target.revealed){
                ++neighborFlagCount;
            }else if(!target.flagged && !target.revealed){
                revealList.push({x,y});
            }
        });

        // reveal tiles if the value matches number of surounding flags
        if(neighborFlagCount === choordTarg.value){
            revealList.forEach( ({x,y}) => {
                if(this.state.board[x][y].revealed) return;
                points += this.state.revealPoints(x,y, owner, i,j);
            });
        }
        else { // update reveal list to account for no tiles being revealed
            console.log("chord did not resolve!");
            revealList = [];
        }

        
        return {points, revealList};
    }
    /**
     * A reveal tile function that skips checking if the tile has already been reveraled, but respects PPP.
     * Used for debugging.
     * 
     * @param {Number} x coordinate
     * @param {Number} y coordinate
     */
    _debugForceClick(x,y){ 
        // **skip checking if tile is revealed**

        // "if revealed, dont send" is the logic that would be used in a real click function

        // if not revealed, dont send (prevents desyncs)
        if(!this.state.board[x][y].revealed) return;

        // send click
        this.conn.send({type: leftClick,x,y,});

        // if user has ppp on the tile
        if(this.state.board[x][y].ppp == this.player){
            // reclaim tiles
            const points = this.state.reclaimTiles(this.player,x,y);
            this.render.drawAll();
            this.render.highlight(this.mouseHandler.curX, this.mouseHandler.curY);
        }
    }
}



// opponents cant remove your flags, at the end you're peanalized for incorrect flags.
// this changes the end condition for multiplayer
// correctly placed flags award no additional points

// OR

// slight penalty upon placing an incorrect flag


// create a dictionary with x,y as the key, and the timestamp & owner & point value of click as the value
/*
let hub = {
    _1_2: {ts: 123, owner: p1, points: 12}
}
* *idea could be used in future
*/
