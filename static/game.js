//Game preference and UI
//

var BLACK = false;
var WHITE = true;
var EMPTY = null;

function Game(size, handicap) {
	this.board_size = size;
	this.handicap = handicap;
    this.board = this.GenBoard(size);

}

Game.prototype.GenBoard = function(size) {
    var self = this;
    var board = new Array(size);

    for (var x = size - 1; x >= 0; x--) {
        board[x] = new Array(size);
        for (var y = size - 1; y >= 0; y--) {
            board[x][y] = EMPTY;
        };
    };
    return board;
};

Game.prototype.SetSettings = function(jsonstring) {
	var settings = JSON.parse(jsonstring);

	this.board_size = settings.board_size;
	this.handicap = settings.handicap;
};