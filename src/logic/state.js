// multiplayer minesweeper board state
import SeedRandom from 'seedrandom';

class Tile{
    constructor(){
        this.position = 'C'; // N | NW | W | SW | S | SE | E | NE | C
        this.value = Math.floor(Math.random() * 10);
        this.revealed = false;
        this.isMine = false;
        this.flagged = false;
        this.owner = null;
        this.timestamp = 0;
        
    }
}
export default class State{
    constructor(height, width, mines, seed){
        this.width = width;
        this.height = height;
        this.mines = mines;
        this.seed = seed;
        this.board = [];
        
        const rightmost = this.width - 1;
        const bottom = this.height - 1;
        const top = 0, leftmost = 0;

        // init board
        for(let i = 0; i < width; ++i){
            this.board.push([]);
            for(let j = 0; j < height; ++j){
                this.board[i].push([]);

                this.board[i][j] = new Tile();

                // determine cells position
                if      (i == rightmost && j == top)    this.board[i][j].position = 'NE';
                else if (i == leftmost  && j == top)    this.board[i][j].position = 'NW';
                else if (i == rightmost && j == bottom) this.board[i][j].position = 'SE';
                else if (i == leftmost  && j == bottom) this.board[i][j].position = 'SW';
                else if (i == leftmost)                 this.board[i][j].position = 'W';
                else if (i == rightmost)                this.board[i][j].position = 'E';
                else if (j == top)                      this.board[i][j].position = 'N';
                else if (j == bottom)                   this.board[i][j].position = 'S';
            }
        }
    }
    reveal(x,y,owner){

        return points; //points earned
    }
    reclaimTiles(tiles){

    }




}