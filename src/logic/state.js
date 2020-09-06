// multiplayer minesweeper board state
import seedrandom from 'seedrandom';

class Tile{
    constructor(){
        this.value = 0;
        this.revealed = false;
        this.isMine = false;
        this.flagged = false;
        this.owner = null;
        this.timestamp = 0;
    }
}

export default class State{
    constructor(height, width, mines, seed, real){
        this.width = width;
        this.height = height;
        this.mines = mines;
        this.rng = seedrandom(`${seed}${mines}${height}${width}`);
        this.board = [];
        
        // init board tiles
        for(let i = 0; i < width; ++i){
            this.board.push([]);
            for(let j = 0; j < height; ++j){
                this.board[i].push([]);
                this.board[i][j] = new Tile();
            }
        }
        if(real){
            this.placeMines();
            this.placeNumbers();
        }
    }
    revealPoints(x,y,owner){
        const target = this.board[x][y];
        let points = 0;

        //check if tile is revealed
        if(target.revealed) return;

        //reveal tile
        target.revealed = true;
        target.owner = owner;
        points += target.value;

        //return early & penalize if mine
        if(target.isMine){
            // mine penalty will need balancing
            // cut points in half?
            // lose points based on mine value?  
            points -= 2 * target.value;
        }

        //check win condition
        if(this.gameWon()) return points;

        //if tile is a zero, recurse over all neighbors
        if(target.value === 0){
            this.neighbors(x,y).forEach(({i,j}) => {
                points += this.revealPoints(i,j, owner);
            });
        }        

        return points;
    }
    reclaimTiles(tiles){

    }
    placeMines(){
        let n = this.mines, x, y, target;

        while(n > 0){
            y = Math.floor(this.rng() * this.height );
            x = Math.floor(this.rng() * this.width );

            target = this.board[x][y];

            //if no mine already at x,y
            if(!target.isMine){
                target.isMine = true;
                --n;
            }
        }
    }
    placeNumbers(){
        for(let i = 0; i < this.width; ++i){
            for(let j = 0; j < this.height; ++j){
                this.neighbors(i,j).forEach( ({x,y}) => {
                    if(this.board[x][y].isMine) this.board[i][j].value++
                });
                //if(this.neighbors(i,j).length < 3) console.log(i,j)
            }
        }
    }
    neighbors(x,y) {
        const h = this.height, w = this.width;
        const neighbors = [
            {x:x+1, y},
            {x, y:y+1},
            {x:x-1, y},
            {x, y:y-1},
            {x:x+1, y:y+1},
            {x:x+1, y:y-1},
            {x:x-1, y:y+1},
            {x:x-1, y:y-1}
        ]
        return neighbors.filter( n => !(
            n.x == w  ||
            n.x < 0   ||
            n.y == h  ||
            n.y < 0  
        ));
    }



}