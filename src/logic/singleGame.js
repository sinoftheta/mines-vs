import State from '@/logic/state';
import Board from '@/logic/board';

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
        this.board = new Board(
            boardRef, 
            this.boardState, 
            px, 
            true, 
            false, 
            (x,y) => {this.leftClick(x,y);},
            (x,y) => {     this.flag(x,y);},
            (x,y) => {    this.chord(x,y);}
        );
        this.firstClick = true;
        this.points = 0;
        

        
    }
    leftClick(x,y){
        if(this.firstClick){
            // redistribute mines around x,y
            // start timer
            this.firstClick = false;
        }
        const points = this.boardState.revealPoints(x,y);
        console.log(`scored: ${points}, total: ${this.points += points}`);
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
        console.log('attempting to flag');
        const target = this.boardState.board[x][y];
        
        if(!target.revealed){
            console.log('flagging');
            target.flagged = !target.flagged;
        }
        console.log(target);
    }
    choord(x,y){

    }
}