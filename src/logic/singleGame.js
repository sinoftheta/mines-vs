import State from '@/logic/state';
import BoardRender from '@/logic/boardRender';
import MouseHandler from './mouseHandler';

import {p1} from '@/logic/const.js'; // for debugging purposes - multiplayer features are tested in singleplayer first

export default class SingleGame{
    /**
     * Manager class for a single player game
     * @param {Element}  boardRef a reference to an html canvas that the board will be rendered on
     * @param {Number}   height height of the board
     * @param {Number}   width width of the board
     * @param {Number}   mines nimber of mines to be placed on the board
     * @param {Number}   px size of game tiles in pixels
     * @param {Function} onEnd onEnd(Boolean win) callback that is executed when the game is finished
     * @param {Function} onMinesRemainingUpdate callback for when remainingMines value changes
     */
    constructor(
        boardRef, 
        height, 
        width, 
        mines,
        px,
        onEnd,
        onMinesRemainingUpdate
        ){
        // save stuff
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.renderRef = boardRef;
        this.px = px;
        this.points = 0;
        this.remainingMines = mines;
        this.firstClick = true;
        this.state  = new State(height, width, mines, Math.random(), true);
        this.render = new BoardRender(
            boardRef, 
            this.state, 
            px, 
            true, // real flag
            false // versus flag
        );
        this.mouseHandler = new MouseHandler(
            boardRef, 
            this.state, 
            this.render,
            (x,y) => { this.leftClick(x,y);},
            (x,y) => {      this.flag(x,y);},
            (x,y) => {     this.chord(x,y);}
        );
        
        this.onEnd = (win) => { onEnd(win); };
        this.onMinesRemainingUpdate = (mines) => {onMinesRemainingUpdate(mines)};

    }
    leftClick(x,y){

        // dont reveal flagged tiles
        if(this.state.board[x][y].flagged){
            return;
        } 

        // keep track of first game click
        if(this.firstClick){
            
            // guarentee zero on first click
            this.state.forceZeroAt(x,y);

            // start timer


            this.firstClick = false;
        }

        // recursive reveal, get points awarded for reveal
        const points = this.state.revealPoints(x, y, p1, x, y);
        //console.log(`scored: ${points}, total: ${this.points += points}`);
        if( points < 0){
            // game lost!
            this.onEnd(false);
            // stop timer
            return;
        }
        else if(this.state.clear){
            // game won
            this.onEnd(true);
            return;
        }
    }
    flag(x,y){ // consider putting this in state?
        const target = this.state.board[x][y];
        if(!target.revealed){
            target.flagged = !target.flagged;

            if(target.flagged)  this.remainingMines -= 1;
            if(!target.flagged) this.remainingMines += 1;
            this.onMinesRemainingUpdate(this.remainingMines);
        }
    }
    chord(i,j){
        const choordTarg = this.state.board[i][j];
        if(!choordTarg.revealed || choordTarg.isMine) return;
        let revealList = [];
        let neighborFlagCount = 0;

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
                this.leftClick(x,y);
            });
        }
    }
}