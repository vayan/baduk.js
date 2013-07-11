//

var socket = new Socket();
var host;
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


    $("#start").click(function() {
        if (!uri) {
            uri = gen_uri(5);
            location.hash = uri;
        }
        host = new Connection(uri, socket);
        host.makeOffer();
    });
    $("#send").click(function() {
        host.dc.send($("#msg").val());
        host.dc2.send($("#msg").val());
    });
});