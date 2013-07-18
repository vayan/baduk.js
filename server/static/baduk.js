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
    };
    host.onmessage = function(s) {
        $("#chatlog").val($('#chatlog').val() + s + "\n");
    };
};

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
        var game = new Game(19, 4);
        log(JSON.stringify(game));
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