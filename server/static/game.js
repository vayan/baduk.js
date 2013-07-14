//Game preference and UI

function Game(size, handicap) {
	this.board_size = size;
	this.handicap = handicap;
}

Game.prototype.SetSettings = function(jsonstring) {
	var settings = JSON.parse(jsonstring);

	this.board_size = settings.board_size;
	this.handicap = settings.handicap;
};