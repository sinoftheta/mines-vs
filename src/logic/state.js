// multiplayer minesweeper board state
import seedrandom from 'seedrandom';
import Tile from '@/logic/tile.js';
import {p1,p2} from '@/logic/const.js';


// for debugging https://nielsleenheer.com/articles/2017/the-case-for-console-hex/
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
        
        // allocate board
        for(let i = 0; i < this.width; ++i){
            this.board.push([]);
            for(let j = 0; j < this.height; ++j){
                this.board[i].push([]);
                this.board[i][j] = new Tile();
            }
        }
        // init board
        if(real){
            this.placeMines();
            this.placeNumbers();
            this.placeIslandIds();
            this.placePpp();
        }
    }
    revealPoints(i,j,owner, originX, originY){
        const target = this.board[i][j];
        let points = 0;

        //check if tile is revealed or flagged
        if(target.revealed || target.flagged) return 0;

        //reveal tile
        target.revealed = true;
        target.owner = owner;
        target.origin = {x: originX, y: originY};
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
                points += this.revealPoints(x,y, owner, originX, originY);
            });
        }
        return points;
    }
    placeMines(){
        let n = this.mines, x, y, target;

        while(n > 0){
            y = Math.floor(this.rng() * this.height );
            x = Math.floor(this.rng() * this.width  );

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
                // assign random ppp. there are better ways to do this will do for now
                // can also be done in constructor, really doesnt matter
                this.board[i][j].ppp = this.rng() > 0.5 ? p1 : p2;

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
    placePpp(){
        const rand = this.rng() > 0.5 ? 0 : 1;
        for(let i = 0; i < this.width; ++i){
            for(let j = 0; j < this.height; ++j){
                // assign random ppp. there are better ways to do this will do for now
                // can also be done in constructor, really doesnt matter
                // all members with the same islandId must have the same ppp
                if(this.board[i][j].value == 0){
                    this.board[i][j].ppp = (rand + this.board[i][j].islandId) % 2 == 0 ? p1 : p2;
                }
                else{
                    this.board[i][j].ppp = this.rng() > 0.5 ? p1 : p2;
                }
                
            }
        }
    }
    /**
     * Reclaims ownership of all tiles that share an origin click as the tile at (x,y)
     * Used for keeping two clients states in sync, after ownership has been determined by the method's caller.
     * 
     * @param {String} newOwner name of new owner
     * @param {Number} x coordinate
     * @param {Number} y coordiante
     */
    reclaimTiles(newOwner, x, y){

        const originTile = this.board[x][y];

        // case 1: tile at x,y is nonzero valued tile or mine
        if(originTile.value != 0 || originTile.isMine){
            
            // just reclaim it, i.e. set new owner
            console.log('reclaiming a nonzero tile @',x,y);
            originTile.owner = newOwner;
            return originTile.value; // return point value
        }
        // case 2: a zero tile...
        if(originTile.value == 0){
            console.log('reclaiming a zero tile @',x,y);
            // you're finding the click that you made with the same island id as the incoming zero click,
            // and actually uncoveered tiles. lets call it UsrClick0
            // then you're reclaiming all the tiles whos origin is UsrClick0
        
            // 1. get island id associated with {x,y}
            // 2. get origin click associated with any tile with that island id
            
            const origin = originTile.origin;
            let points = 0;
            // 3. reclaim all tiles (and their points) with the same origin click
            for(let i = 0; i < this.width; ++i){  
                for(let j = 0; j < this.height; ++j){
                    const target = this.board[i][j];
                    if(
                        target.origin.x == originTile.origin.x && 
                        target.origin.y == originTile.origin.y
                    ){
                        points += target.points;
                        target.owner = newOwner;
                    }
                }
            }
            return points;
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

    // unused...

    placeIslandIds(){
        let id = 0;
        for(let i = 0; i < this.width; ++i){
            for(let j = 0; j < this.height; ++j){
                const target = this.board[i][j];
                if(target.value == 0 && target.checked == false){
                    this.markIslandRecursive(i, j, id);
                } 
                else if(target.value != 0){
                    target.islandId = id;
                    target.checked = true;
                }
                id++;
            }
        }
    }
    markIslandRecursive(i, j, id){
        const target = this.board[i][j];
        if (target.checked) return;
        target.checked = true;
        target.islandId = id;

        this.neighbors(i,j).forEach( ({x,y}) => {
            if(this.board[x][y].value == 0 && this.board[x][y].checked == false){
                this.markIslandRecursive(x, y, id);
            }
        });


    }
    uncheckAll(){
        for(let i = 0; i < width; ++i){
            for(let j = 0; j < height; ++j){
                this.board[i][j]. checked = false;
            }
        }
    }


}