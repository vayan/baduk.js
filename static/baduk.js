//"main"

var socket = new Socket();
var host;
var game;
var uri = window.location.hash.replace("#", "");

socket.onconnectioncreated = function(e) {
    host.onshareurl = function(e) {
        log("_GAME_ " + '[c="color: red"]you can share the url[c]');
        $("#loading-message").text("Share this url with someone");
    };

    host.onconnected = function(e) {
        log("_GAME_ " + '[c="color: red"]P2P link etablished[c]');
        socket.close();
        $(".page-state").hide();
        $("#gaming").show();
        if (game) {
            host.send({
                "action": "GAME",
                "data": JSON.stringify(game)
            });
        }
    };
    host.onmessage = function(s) {
        var resp = JSON.parse(s);

        switch (resp.action) {
            case 'UPDATE':
                game.UpdateBoard(resp.data);
                break;
            case 'EVENT':
                //TODO : lose win surrender etc..Etc..
                break;
            case 'GAME':
                new_game(1, 1);
                game.SetSettings(resp.data);
                break;
        }
        $("#chatlog").val($('#chatlog').val() + s + "\n");
    };
};

function new_game(size, handi) {
    game = new Game(size, handi);
    game.onboardupdate = function(e) {
        log("_GAME_ : receive move");
        //TODO : UPDATE UI
    };
    game.onboardchange = function(e) {
        log("_GAME_ : new local move");
        //TODO : SEND BOARD
    };
}

function gen_uri(size) {
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var uri = "";

    for (var i = 0; i <= size; i++) {
        uri += charset.charAt(Math.floor(Math.random() * charset.length));
    };
    return uri;
}

$(document).ready(function() {
    //if hash in url, joining game
    if (uri.length > 0) {
        $("#loading").show();
    } else {
        $("#landing").show();
    }

    $("#start").click(function() {
        new_game(19, 0);
        if (!uri) {
            uri = gen_uri(5);
            location.hash = uri;
        }
        socket.sendKey(uri);
        $(".page-state").hide();
        $("#loading").show();
    });
    $("#send").click(function() {
        host.send($("#msg").val());
        $("#chatlog").val($('#chatlog').val() + $("#msg").val() + "\n");
        $("#msg").val("");
    });
});