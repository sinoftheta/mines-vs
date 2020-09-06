import State from '@/logic/state';
import Board from '@/logic/board';

export default class SingleGame{
    constructor(
        boardRef, 
        height, 
        width, 
        mines,
        ){
        // save stuff
        this.height = height;
        this.width = width;
        this.mines = mines;
        this.boardRef = boardRef;
        this.boardState = new State(height, width, mines, Math.random(), true);
        this.board = new Board(
            boardRef, 
            this.boardState, 
            30, 
            true, 
            (x,y) => {
                return new Promise(resolve => {
                    this.leftClick(x,y);
                    resolve();
            })}
        );
        this.firstClick = true;
        

        
    }
    leftClick(x,y){
        if(this.firstClick){
            // redistribute mines around x,y
            // start timer
            this.firstClick = false;
        }
        const points = this.boardState.revealPoints(x,y);
        if( points < 0){
            // game lost!
            // stop timer
            return;
        }

        if(this.boardState.clear){
            // game won
            return;
        }
    }
}