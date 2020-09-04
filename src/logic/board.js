// renders minesweeper board on canvas
// handles canvas click functionality

const theme = {
    border: '#808080',
    background1: '#c0c0c0',
    background2: '#c8c8c8',
    cover1: '#474798',
    cover2: '#5050a5',
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
    constructor(canvasRef, gameState, px){
        this.state = gameState;
        this.px = px;
        this.canvas = canvasRef;
        this.canvas.height = px * this.state.height;
        this.canvas.width  = px * this.state.width;
        this.canvas.onmousemove = (e) => {this.updateCursor(e)};
        this.ctx = this.canvas.getContext('2d');

        this.prevX = -1;
        this.prevY = -1;
        this.curY = -1;
        this.curX = -1;

        this.drawAll();
    }
    drawAll(){
        const ctx = this.ctx;
        const state = this.state;
        const px = this.px;

        ctx.lineWidth = '1';
        ctx.font = `${px * .6}px Impact`;
        ctx.textAlign = 'center';

        for(let i = 0; i < state.width; ++i){
            for(let j = 0; j < state.height; ++j){
                this.draw(i,j);
            }
        }

    }
    draw(i,j){
        if(i < 0 || j < 0) return;
        const px = this.px;
        const ctx = this.ctx;
        const state = this.state;

        let light = xor( i % 2 == 0, j % 2 == 0);

        ctx.beginPath();
        ctx.rect(i * px, j * px, px, px);

        if(state.board[i][j].revealed){
            //draw covered cell
            ctx.strokeStyle = light ? theme.cover1 : theme.cover2;
            ctx.fillStyle =  light ? theme.cover1 : theme.cover2;
            ctx.fill();
            ctx.stroke();

        }else{
            // draw revealed cell
            ctx.fillStyle = light? theme.background1 : theme.background2;
            ctx.strokeStyle = light ? theme.background1 : theme.background2;
            ctx.fill();
            ctx.stroke();

            if(state.board[i][j].isMine){
                //draw mine
                ctx.beginPath();
                ctx.fillStyle = theme.mine;
                ctx.lineWidth = 0;
                ctx.arc(
                    (i + 0.5) * px, 
                    (j + 0.5) * px, 
                    px * 0.25, 
                    0, 
                    2 * Math.PI);
                ctx.fill();
                
            }
            else{
                //draw value
                ctx.fillStyle = theme['_' + state.board[i][j].value];
                ctx.fillText(state.board[i][j].value, (i + 0.5) * px, (j + 0.5) * px + 7);
            }
        }

    }
    updateCursor(e){
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(Math.floor(e.clientX - rect.left) / this.px);
        const y = Math.floor(Math.floor(e.clientY - rect.top) / this.px);
        
        if(this.curX != x || this.curY != y){
            //update current tile coordinates
            this.prevX = this.curX;
            this.prevY = this.curY;
            this.curY = y;
            this.curX = x;

            this.highlightCur();
            this.draw(this.prevX, this.prevY);
        }
    }
    highlightCur(){
        if(this.curX < 0 || this.curY < 0) return;

        const target = this.state.board[this.curX][this.curY];
        const ctx = this.ctx, px = this.px;
        if(target.revealed || !(target.value == 0 || target.isMine)){
            ctx.beginPath();
            ctx.fillStyle = theme.hover;
            ctx.strokeStyle = theme.hover;
            ctx.rect(this.curX * px, this.curY * px, px, px);
            ctx.fill();
            ctx.stroke();
        }
    }

}