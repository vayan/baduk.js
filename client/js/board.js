var context, color, cW, cH;
var playersTurn = true;

//grid width and height
var caseW = 40;
var caseH = 40;
var nbCases = 18;
var bW = caseW * nbCases;
var bH = caseH * nbCases;
var arrayBoard = new Array(bW);

//padding around grid
var p = 10;
var padding = (p*2) + 1;

$(document).ready(function(){
    init();
});

function init() {

    context = $('#board_canvas')[0].getContext('2d');
    cW = $("canvas").attr("width", bW+padding);
    cH = $("canvas").attr("height", bH+padding);

    drawGoban();
    playGo();
}

function drawGoban(){

    for (var x = 0; x <= bW; x += 40) {

        context.moveTo(0.5 + x + p, p);
        context.lineTo(0.5 + x + p, bH + p);
    }

    for (var x = 0; x <= bH; x += 40) {

        context.moveTo(p, 0.5 + x + p);
        context.lineTo(bW + p, 0.5 + x + p);
    }

    context.strokeStyle = "#000000";
    context.stroke();
    drawHoshiTengen();
}

function playGo() {

    $('#board_canvas').click(function(e) {
        putStone(e.pageX, e.pageY);

        console.log(e.pageX);
        console.log(e.pageY);

    });
}

function putStone(xMouse, yMouse) {

    if (playersTurn == true) {
        color = "black";
    }
    else if (playersTurn == false){
        color = "white";
    }
console.log("mouseX : " + xMouse);
    playersTurn = !playersTurn;

    context.beginPath();
    context.arc(xMouse-(p*2), yMouse-(p*2), 15, 0, Math.PI*2, true);
    context.closePath();
    context.fillStyle=color;
    context.fill();
    context.strokeStyle="black";
    context.stroke();
}

function drawHoshiTengen() {
    if (nbCases == 18) {

        context.beginPath();

        // hoshis
        // x = 3
        context.arc(nbCases/6*caseW+padding/2 , nbCases/6*caseH+ padding/2, 8, 0, Math.PI*2, true);
        context.arc(nbCases/6*caseW+padding/2 , (nbCases-3)*caseH+ padding/2, 8, 0, Math.PI*2, true);
        context.arc(nbCases/6*caseW+padding/2 , nbCases/2*caseH+ padding/2, 8, 0, Math.PI*2, true);

        // x = 9
        context.arc(nbCases/2*caseW+padding/2 , nbCases/6*caseH+ padding/2, 8, 0, Math.PI*2, true);
        context.arc(nbCases/2*caseW+padding/2 , (nbCases-3)*caseH+ padding/2, 8, 0, Math.PI*2, true);

        // x = 15
        context.arc((nbCases-3)*caseW+padding/2 , nbCases/6*caseH+ padding/2, 8, 0, Math.PI*2, true);
        context.arc((nbCases-3)*caseW+padding/2 , (nbCases-3)*caseH+ padding/2, 8, 0, Math.PI*2, true);
        context.arc((nbCases-3)*caseW+padding/2 , nbCases/2*caseH+ padding/2, 8, 0, Math.PI*2, true);

        // tengen
        context.arc(nbCases/2*caseW+padding/2 , nbCases/2*caseH+ padding/2, 10, 0, Math.PI*2, true);
        context.closePath();
        context.fill();

        context.beginPath();
        context.arc(nbCases/2*caseW+padding/2 , nbCases/2*caseH+ padding/2, 6, 0, Math.PI*2, true);
        context.strokeStyle="white";
        context.closePath();
        context.stroke();
    }
    else {

    }
}

function realPos() {

}
/*
function fillArrayBoard(, ) {

    for (var x = 0; x < bW; x += caseH) {

        // code here
        arrayBoard[x] = new Array(bH);
        for (var y = 0; y < bH; y += caseW) {

            // code here
            arrayBoard[x][y] = '';
        }
    }
}








//YOUR TURN

onclick(x_pixel, y_pixel) {
    x, y = RealPos() //ca calcul les positions reel depuis les position pixel
    putstone(x,y, mycolor);
}

putstone(x,y, color) {
    board[x][y] = color
    RefreshBoard(board); //ca prend l'array et redessinne TOUTE la board graphique
}


function removeStone() {
    //SOON
}


function Game(x, y) {
    this.size_x = x;
    this.size_y = y;
    this.board = [];

}

Game.prototype.GenBoard = function(x, y) {
    return [] ;
};

Game.prototype.PutStone = function(first_argument) {

};
 */