
import {p1,p2, neither} from '@/logic/const.js';
const value    = 0b00001111; // bits 0 - 3
const revealed = 0b00010000; // bit 4. 8 = 2^3
const isMine   = 0b00100000; // bit 5
const flagged  = 0b01000000; // bit 6
const p2bit    = 0b10000000; // bit 7.
const p1bit    = 0b00000000;


export default class Tile{
    constructor(){
        this.value    = 0;
        this.revealed = false;
        this.isMine   = false;
        this.flagged  = false;

        //multiplayer data
        this.checked  = false;
        this.origin   = {x: null, y: null};
        this.islandId = 0;
        this.owner    = neither; // which player owns the tile
        this.ppp      = neither;   // player point priority 

    }
    // these work but need to be redone
    byteRepresentation(){
        return String.fromCharCode(
            (this.value & value)           |
            (this.revealed ? revealed : 0) |
            (this.isMine   ? isMine   : 0) |
            (this.flagged  ? flagged  : 0) | 
            (this.owner == p2 ? p2bit : p1bit)
        );
    }
    loadFromByte(char){
        const byte = char.charCodeAt(0);
        this.value = byte & value;
        this.revealed = !!(byte & revealed);
        this.isMine   = !!(byte & isMine);
        this.flagged  = !!(byte & flagged);
        this.owner = byte & p2bit ? p2 : p1;
    }
}