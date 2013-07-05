var context;
//grid width and height
var bw = 400;
var bh = 400;
//padding around grid
var p = 10;
//size of canvas (420*420)
//var cw = bw + (p*2) + 1;
//var ch = bh + (p*2) + 1;

$(document).ready(function(){
    init();
});

function init() {

    context = $('#board_canvas')[0].getContext('2d');

    drawBoard();
    playGo();
}

function drawBoard(){

    for (var x = 0; x <= bw; x += 40) {

        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bh + p);
    }

    for (var x = 0; x <= bh; x += 40) {

        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bw + p, 0.5 + x + p);
    }

    context.strokeStyle = "black";
    context.stroke();
}

function playGo() {

    $('#board_canvas').click(function(e) {

        putStone(e.pageX, e.pageY);
    });
}

function putStone(xMouse, yMouse ) {

    context.beginPath();
    context.arc(xMouse-(p*2), yMouse-(p*2), 15, 0, Math.PI*2, true);
    console.log(xMouse);
    console.log(yMouse);
    context.closePath();
    context.fill();
}

function removeStone() {
    //SOON
}

