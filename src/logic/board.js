// renders minesweeper board on canvas
// handles canvas click functionality

const theme = {
    border: '#808080',
    background: '#c0c0c0',
    cover: '#474798',
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
                ctx.beginPath();
                ctx.rect(i * px, j * px, px, px);

                if(state.board[i][j].revealed){
                    //draw covered cell
                    ctx.strokeStyle = theme.cover;
                    ctx.fillStyle =   theme.cover;
                    ctx.fill();
                    ctx.stroke();

                }else{
                    // draw revealed cell
                    ctx.fillStyle = theme.background;
                    ctx.strokeStyle = theme.background;
                    ctx.fill();
                    ctx.stroke();

                    if(state.board[i][j].isMine){
                        //draw mine
                    }
                    else{
                        ctx.fillStyle = theme['_' + state.board[i][j].value];
                        //draw value
                        ctx.fillText(state.board[i][j].value, (i + 0.5) * px, (j + 0.5) * px + 7);
                    }
                }
            }
        }

    }
    draw(x,y){
        const px = this.px;
        const ctx = this.ctx;
        const state = this.state;
        ctx.beginPath();
        ctx.rect(x * px, y * px, px, px);
        ctx.stroke();
    }
    updateCursor(e){
        const rect = this.canvas.getBoundingClientRect();
        const x = Math.floor(Math.floor(e.clientX - rect.left) / this.px);
        const y = Math.floor(Math.floor(e.clientY - rect.top) / this.px);
        
        let update = this.prevX != x || this.prevY != y;
        if(this.prevX != x) this.prevX = x;
        if(this.prevY != y) this.prevY = y;
        if(update){

        }
    }

}