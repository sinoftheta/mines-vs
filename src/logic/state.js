// multiplayer minesweeper board state
import seedrandom from 'seedrandom';
import Tile from '@/logic/tile.js';



console.hex = (d) => console.log((Object(d).buffer instanceof ArrayBuffer ? new Uint8Array(d.buffer) : 
typeof d === 'string' ? (new TextEncoder('utf-8')).encode(d) : 
new Uint8ClampedArray(d)).reduce((p, c, i, a) => p + (i % 16 === 0 ? i.toString(16).padStart(6, 0) + '  ' : ' ') + 
c.toString(16).padStart(2, 0) + (i === a.length - 1 || i % 16 === 15 ? 
' '.repeat((15 - i % 16) * 3) + Array.from(a).splice(i - i % 16, 16).reduce((r, v) => 
r + (v > 31 && v < 127 || v > 159 ? String.fromCharCode(v) : '.'), '  ') + '\n' : ''), ''));





export default class State{
    constructor(height, width, mines, seed, real){
        this.width = width;
        this.height = height;
        this.mines = mines;
        this.rng = seedrandom(`${seed}${mines}${height}${width}`);
        this.uncoveredSafeTiles = 0;
        this.board = [];
        this.mineList = [];
        
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
    revealPoints(i,j,owner){
        const target = this.board[i][j];
        let points = 0;

        //check if tile is revealed or flagged
        if(target.revealed || target.flagged) return 0;

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
            return points;
        }else{
            this.uncoveredSafeTiles++;
        }

        //check win condition
        if(this.clear) return points;

        //if tile is a zero, recurse over all neighbors
        if(target.value === 0){
            this.neighbors(i,j).forEach( ({x,y}) => {
                points += this.revealPoints(x,y, owner);
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
                target.value = 9;
                this.mineList.push({x,y});
                --n;
            }
        }
        this.mineList.sort((a,b) => {
            if(a.x > b.x) return 1;
            if(a.x < b.x) return -1;
            if(a.y > b.y) return 1;
            return -1; 
        });
        //console.log(this.mineList);
    }
    placeNumbers(){
        for(let i = 0; i < this.width; ++i){
            for(let j = 0; j < this.height; ++j){
                this.neighbors(i,j).forEach( ({x,y}) => {
                    if(this.board[x][y].isMine) this.board[i][j].value++
                });
                //TODO: turn these into tests

                //if(this.neighbors(i,j).length < 3) console.log(i,j)

                /*                
                console.hex(this.board[i][j].byteRepresentation());
                console.log(this.board[i][j]);
                this.board[i][j].loadFromByte(this.board[i][j].byteRepresentation());
                console.hex(this.board[i][j].byteRepresentation());
                console.hex(this.board[i][j]);
                console.log('=======================');
                */
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
    get clear(){
        // area - uncovered = mines
        return (this.height * this.width) - this.uncoveredSafeTiles === this.mines;
    }


}