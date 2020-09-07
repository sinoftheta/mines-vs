// renders minesweeper state on canvas
// handles baseline canvas click functionality

const theme = {
    border: '#808080',
    background1: '#c0c0c0',
    background2: '#c8c8c8',
    p1Background1: '#dfc0c0',
    p1Background2: '#dfc8c8',
    p2Background1: '#c0c0df',
    p2Background2: '#c8c8df',
    cover1: '#474798',
    cover2: '#5050a5',
    coverBorder: '#404080',
    _1: '#0000f0',
    _2: '#008000',
    _3: '#f00000',
    _4: '#000080',
    _5: '#800000',
    _6: '#008080',
    _7: '#000000',
    _8: '#808080',
    _9: '#808000',
    hover: '#ffffff30',
    enimyHover: '#00000030',
    mine: '#000000'
}

const leftMouse = 1;
const rightMouse = 2;
const middleMouse = 4;

function xor(a,b) {
    return ( a ? 1 : 0 ) ^ ( b ? 1 : 0 );
}

export default class Board{
    constructor(canvasRef, gameState, px, real, versus, submitClick){
        this.real = real;
        this.versus = versus;
        this.state = gameState;
        this.px = px;
        this.canvas = canvasRef;
        this.canvas.height = px * this.state.height;
        this.canvas.width  = px * this.state.width;
        this.submitClick = (x,y) => {submitClick(x,y)};
        this.ctx = this.canvas.getContext('2d');
        this.canvas.onmousemove = (e) => {this.mouseMove(e)};
        this.canvas.onmousedown = (e) => {this.mouseDown(e)};
        this.canvas.onmouseup   = (e) => {this.mouseUp(e)};
        this.canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); };

        this.prevX = -1;
        this.prevY = -1;
        this.curY  = -1;
        this.curX  = -1;

        this.drawAll();
    }
    oob(x,y){ 
        return x >= this.state.width || x < 0 || y >= this.state.height || y < 0;  
    }
    drawAll(){
        const ctx = this.ctx;
        const state = this.state;
        const px = this.px;

        ctx.lineWidth = 1;
        ctx.font = `${px * .6}px Impact`;
        ctx.textAlign = 'center';

        for(let i = 0; i < state.width; ++i){
            for(let j = 0; j < state.height; ++j){
                this.drawTileState(i,j);
            }
        }
    }
    drawTileState(i,j){
        //TODO: break into drawValue(x,y,n), drawMine(x,y), drawCover(x,y)
        if(this.oob(i,j)) return;

        this.ctx.beginPath();
        this.ctx.rect(i * this.px, j * this.px, this.px, this.px);

        if(!this.state.board[i][j].revealed){
            this.drawCover(i, j);

        }else{
            this.drawBackground(i,j);

            if(this.state.board[i][j].isMine){
                this.drawMine(i, j);
            }else{
                this.drawValue(i, j, this.state.board[i][j].value);
            }
        }
    }
    drawBackground(x,y){
        const light = xor( x % 2 == 0, y % 2 == 0);

        // draw revealed cell
        if(this.versus && this.state.board[x][y].owner){
            this.ctx.fillStyle = light ? theme.p1Background1 : theme.p1Background2;
        }
        else if(this.versus && !this.state.board[x][y].owner){
            this.ctx.fillStyle = light ? theme.p2Background1 : theme.p2Background2;
        }
        else{
            this.ctx.fillStyle = light ? theme.background1 : theme.background2;
        }
        this.ctx.strokeStyle = this.ctx.fillStyle;
        this.ctx.fill();
        this.ctx.stroke();
    }
    drawValue(x,y,n){
        this.ctx.fillStyle = theme['_' + n];
        this.ctx.fillText(n, (x + 0.5) * this.px, (y + 0.5) * this.px + 7);
    } 
    drawMine(x,y){
        //draw mine
        this.ctx.beginPath();
        this.ctx.fillStyle = theme.mine;
        this.ctx.lineWidth = 0;
        this.ctx.arc(
            (x + 0.5) * this.px, 
            (y + 0.5) * this.px, 
            this.px * 0.25, 
            0, 
            2 * Math.PI);
        this.ctx.fill();
    } 
    drawCover(x,y){
        const ctx = this.ctx;
        const light = xor( x % 2 == 0, y % 2 == 0);
        const px = this.px;
        //draw covered cell
        ctx.strokeStyle = light ? theme.cover1 : theme.cover2;
        ctx.fillStyle = ctx.strokeStyle;
        ctx.fill();
        ctx.stroke();

        
        /* 
        //draw edges based on empty neighbors
        //logic is fine, drawing lines is glitchy
        ctx.beginPath();
        ctx.strokeStyle = theme.coverBorder;
        ctx.lineWidth = 1;
        if(x + 1 < this.state.height && this.state.board[x + 1][y].revealed){
            //draw east (x) boarder
            ctx.moveTo((x + 1) * px, y * px);
            ctx.lineTo((x + 1) * px, (y + 1) * px);
        }
        if(x - 1 > 0 && this.state.board[x - 1][y].revealed){
            //draw west boarder
            ctx.moveTo(x * px, y * px);
            ctx.lineTo(x * px, (y + 1) * px);
        }
        if(y + 1 < this.state.height && this.state.board[x][y + 1].revealed){
            //draw north boarder
            ctx.moveTo((x + 1) * px, (y + 1) * px);
            ctx.lineTo(x * px,       (y + 1) * px);
        }
        if(y - 1 > 0 && this.state.board[x][y - 1].revealed){
            //draw south boarder
            ctx.moveTo((x + 1) * px, y * px);
            ctx.lineTo(x * px,       y * px);
        }
        ctx.stroke();
        ctx.lineWidth = 1;
        */
    }
    highlightCur(){
        if(this.curX < 0 || this.curY < 0) return;

        const target = this.state.board[this.curX][this.curY];
        const ctx = this.ctx, px = this.px;
        if(!target.revealed || !(target.value == 0 || target.isMine)){
            ctx.beginPath();
            ctx.fillStyle = theme.hover;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.rect(this.curX * px, this.curY * px, px, px);
            ctx.fill();
            ctx.stroke();
        }
    }
    anticipateRevealCur(){
        if(this.curX < 0 || this.curY < 0) return;

        const light = xor( this.curX % 2 == 0, this.curY % 2 == 0);
        const target = this.state.board[this.curX][this.curY];
        const ctx = this.ctx, px = this.px;
        if(!target.revealed){
            ctx.beginPath();
            ctx.fillStyle = light ? theme.background1 : theme.background2;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.rect(this.curX * px, this.curY * px, px, px);
            ctx.fill();
            ctx.stroke();
        }
    }

    // mouse behavior ...move to a different obj?
    mouseMove(e){
        //if(this.versus) this.drawAll();
        //console.log(e.buttons);
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(Math.floor(e.clientX - rect.left) / this.px);
        const y = Math.floor(Math.floor(e.clientY - rect.top)  / this.px);
        
        if(this.curX != x || this.curY != y){
            //update current tile coordinates
            this.prevX = this.curX;
            this.prevY = this.curY;
            this.curY = y;
            this.curX = x;

            this.drawAll();

            if(e.buttons & leftMouse){
                this.anticipateRevealCur();
            }
            else{
                this.highlightCur();
            }
            //this.drawTileState(this.prevX, this.prevY);
            
        }
    }

    mouseUp(e){
        this.drawTileState(this.curX, this.curY);
        this.highlightCur();
        if(!this.real) return;
        //somehow check that it was a left click up...?

        //console.log('up on', this.curX, this.curY);
        //call click on x,y
        this.submitClick(this.curX, this.curY);
        this.drawAll();
        this.highlightCur();
    }
    mouseDown(e){
        this.anticipateRevealCur();
    }
}