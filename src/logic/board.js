// renders minesweeper state on canvas
// handles baseline canvas click functionality

const theme = {
    border: '#808080',
    background1: '#c0c0c0',
    background2: '#c8c8c8',
    cover1: '#474798',
    cover2: '#5050a5',
    coverBorder: '#424280',
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

function xor(a,b) {
    return ( a ? 1 : 0 ) ^ ( b ? 1 : 0 );
}

export default class Board{
    constructor(canvasRef, gameState, px, real, versus){
        this.real = real;
        this.versus = versus;
        this.state = gameState;
        this.px = px;
        this.canvas = canvasRef;
        this.canvas.height = px * this.state.height;
        this.canvas.width  = px * this.state.width;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.onmousemove = (e) => {this.updateCursor(e)};
        this.canvas.oncontextmenu = function(e) { e.preventDefault(); e.stopPropagation(); }

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

        ctx.lineWidth = 0;
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
            }
            else{
                this.drawValue(i, j, this.state.board[i][j].value);
            }
        }
    }
    drawBackground(x,y){
        const light = xor( x % 2 == 0, y % 2 == 0);

        // draw revealed cell
        this.ctx.fillStyle = light ? theme.background1 : theme.background2;
        this.ctx.strokeStyle = light ? theme.background1 : theme.background2;
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
        ctx.fillStyle =  light ? theme.cover1 : theme.cover2;
        ctx.fill();
        ctx.stroke();

        /*
        //draw edges based on empty neighbors
        // upper left coords: x * px, y * px
        ctx.beginPath();
        ctx.strokeStyle = '#ff0000'//theme.coverBorder;
        ctx.lineWidth = 5;
        if(x + 1 < this.state.height && this.state.board[x + 1][y].revealed){
            //draw east (x+) boarder
            ctx.moveTo((x + 1) * px, y * px);
            ctx.lineTo((x + 1) * px, y * px);
        }
        ctx.stroke();
        ctx.lineWidth = 0;
        */
    }
    highlightCur(){
        if(this.curX < 0 || this.curY < 0) return;

        const target = this.state.board[this.curX][this.curY];
        const ctx = this.ctx, px = this.px;
        if(!target.revealed || !(target.value == 0 || target.isMine)){
            ctx.beginPath();
            ctx.fillStyle = theme.hover;
            ctx.strokeStyle = theme.hover;
            ctx.rect(this.curX * px, this.curY * px, px, px);
            ctx.fill();
            ctx.stroke();
        }
    }
    updateCursor(e){
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(Math.floor(e.clientX - rect.left) / this.px);
        const y = Math.floor(Math.floor(e.clientY - rect.top)  / this.px);
        
        if(this.curX != x || this.curY != y){
            //update current tile coordinates
            this.prevX = this.curX;
            this.prevY = this.curY;
            this.curY = y;
            this.curX = x;

            this.highlightCur();
            this.drawTileState(this.prevX, this.prevY);
        }
    }
}