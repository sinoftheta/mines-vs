import State from '@/logic/state';
import Board from '@/logic/board';
import Peer from 'peerjs';

//https://glitch.com/edit/#!/peerjs-video?path=public%2Fmain.js%3A1%3A0

export default class MultiGame{
    constructor(boardRef, height, width, mines, userId, peerId){


        this.seed = userId + peerId;

        this.state = new State(height, width, mines, this.seed);
        this.board = new Board(boardRef, this.state, 30);

    }
    
}