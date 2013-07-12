//

var socket = new Socket();
var host;
var game;
var uri = window.location.hash.replace("#", "");

function gen_uri(size) {
    var charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var uri = "";

    for (var i = 0; i <= size; i++) {
        uri += charset.charAt(Math.floor(Math.random() * charset.length));
    };
    return uri;
}

$(document).ready(function() {

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
        $("#chatlog").val($('#chatlog').val()+$("#msg").val()+"\n");
        $("#msg").val("");
    });
});