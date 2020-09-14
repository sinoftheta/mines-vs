import State from '@/logic/state';
import BoardRender from '@/logic/boardRender';
import MouseHandler from './mouseHandler';

import {p1,p2} from '@/logic/const.js'; // for debugging purposes - multiplayer features are tested in singleplayer first

export default class SingleGame{
    constructor(
        boardRef, 
        height, 
        width, 
        mines,
        px
        ){
        // save stuff
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.boardRef = boardRef;
        this.px = px;
        this.boardState = new State(height, width, mines, 1, true);
        this.board = new BoardRender(
            boardRef, 
            this.boardState, 
            px, 
            true, // real flag
            false // versus flag
        );
        this.mouseHandler = new MouseHandler(
            boardRef, 
            this.boardState, 
            this.board,
            true, // real flag
            (x,y) => { this.leftClick(x,y);},
            (x,y) => {      this.flag(x,y);},
            (x,y) => {     this.chord(x,y);}
        );
        this.firstClick = true;
        this.points = 0;
    }
    leftClick(x,y){

        //dont reveal flagged tiles
        if(this.boardState.board[x][y].flagged){
            return;
        } 

        // keep track of first game click
        if(this.firstClick){
            // redistribute mines around x,y
            // start timer
            this.firstClick = false;
        }

        // recursive reveal, get points awarded for reveal
        const points = this.boardState.revealPoints(x, y, p1, x, y);
        //console.log(`scored: ${points}, total: ${this.points += points}`);
        if( points < 0){
            // game lost!
            // stop timer
            return;
        }

        if(this.boardState.clear){
            // game won
            console.log('game over!');
            return;
        }
    }
    flag(x,y){
        const target = this.boardState.board[x][y];
        if(!target.revealed){
            target.flagged = !target.flagged;
        }
    }
    chord(i,j){
        const choordTarg = this.boardState.board[i][j];
        if(!choordTarg.revealed || choordTarg.isMine) return;
        let revealList = [];
        let neighborFlagCount = 0;

        // count neighboring flags and save potential tile coordinates to reveal 
        this.boardState.neighbors(i,j).forEach( ({x,y}) => {
            const target = this.boardState.board[x][y];
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