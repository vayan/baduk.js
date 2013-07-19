var context, color, cW, cH;
var playersTurn = true;

//grid width and height
var caseW = 40;
var caseH = 40;
var nbCases = 18;
var bW = caseW * nbCases;
var bH = caseH * nbCases;
var arrayBoard = new Array(bW);

var contexttest, widthtest, heighttest, derp;
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

    contexttest = $('#testyo')[0].getContext('2d');
    heighttest = $('#testyo').attr("height", 300);
    widthtest = $('#testyo').attr("width", 300);

    contexttest.beginPath();
    contexttest.moveTo(150, 0);
    contexttest.lineTo(150, 300)
    contexttest.moveTo(0, 150);
    contexttest.lineTo(300, 150);
    contexttest.strokeStyle = "#000000";
    contexttest.stroke();

    cloneCanvas('#testyo');

    drawGoban();
    playGo();
}

function cloneCanvas(oldCanvas) {

    //create a new canvas
    var newCanvas = document.createElement('canvas');
    var contextclone = newCanvas.getContext('2d');

    //set dimensions
    //newCanvas.width = oldCanvas.width;
    //newCanvas.height = oldCanvas.height;

    //apply the old canvas to the new one
    //contextclone.drawImage(oldCanvas, 0, 0);

    //return the new canvas
    return newCanvas;
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

function testdrawBoard() {

}