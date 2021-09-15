
import {p1,p2, none, leftMouse, rightMouse, middleMouse} from '@/logic/const.js';

export default class MouseHandler{
    constructor(canvasRef, gameState, boardRender, submitClick, submitFlag, submitChord, _debugForceClick){
        this.canvas = canvasRef;
        this.state = gameState;
        this.render = boardRender;
        this.px = boardRender.px;

        this.submitClick  = (x,y) => { submitClick(x,y); };
        this.submitChord  = (x,y) => { submitChord(x,y); };
        this.submitFlag   = (x,y) => { submitFlag(x,y);  };
        this._debugForceClick = (x,y) => { _debugForceClick(x,y); };
        this.canvas.onmousemove = (e) => { this.mouseMove(e) };
        this.canvas.onmousedown = (e) => { this.mouseDown(e) };
        this.canvas.onmouseup   = (e) => { this.mouseUp(e)   };
        window.onkeydown = (e) => { this.onKeyPress(e.key); };
        this.canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); };
        

        this.curButton = none;
        this.prevX = -1;
        this.prevY = -1;
        this.curY  = -1;
        this.curX  = -1;
    }
    mouseMove(e){

        this.recordButtonsPressed(e.buttons);
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(Math.floor(e.clientX - rect.left) / this.px);
        const y = Math.floor(Math.floor(e.clientY - rect.top)  / this.px);
        
        if(this.curX != x || this.curY != y){
            //update current tile coordinates
            this.prevX = this.curX;
            this.prevY = this.curY;
            this.curY = y;
            this.curX = x;

            this.render.drawAll();

            switch(this.curButton){
                case leftMouse:
                    this.render.anticipateReveal(this.curX, this.curY);
                    break;
                case middleMouse:
                    this.render.anticipateChord(this.curX, this.curY);
                    break;
                case none:
                    this.render.highlight(this.curX, this.curY);

            }            
        }
    }

    mouseUp(){
        switch(this.curButton){
            case leftMouse:
                this.submitClick(this.curX, this.curY);
                break;
            case rightMouse:
                break;
            case middleMouse:
                this.submitChord(this.curX, this.curY);
                break;
            default:
        }
        this.render.drawAll();
        this.render.highlight(this.curX, this.curY);
    }
    mouseDown(e){
        // save the button pressed
        this.recordButtonsPressed(e.buttons);


        switch(this.curButton){
            case leftMouse:
                this.render.anticipateReveal(this.curX, this.curY);
                break;
            case rightMouse:
                this.submitFlag(this.curX, this.curY);
                this.render.drawAll();
                this.render.highlight(this.curX, this.curY);
                break;
            case middleMouse:
                this.render.anticipateChord(this.curX, this.curY);
                break;
            default:
        }
    }
    recordButtonsPressed(buttons){
        if      (buttons & leftMouse)   this.curButton = leftMouse;
        else if (buttons & rightMouse)  this.curButton = rightMouse;
        else if (buttons & middleMouse) this.curButton = middleMouse;
        else                            this.curButton = none;
    }
    onKeyPress(key){
        switch(key){
            default:
                return;
            // debug tools
            case 'f': // force send click to opponent
                this._debugForceClick(this.curX,this.curY);
                break;
            case 'd': // log tile state
                console.log(this.curX + ',' + this.curY + ':', this.state.board[this.curX][this.curY]);
                break;
        }
    }
}