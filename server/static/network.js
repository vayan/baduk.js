var ws;
var conn_started = false;
var peerConn = null;
var cfg = {"iceServers":[{"url":"stun:stun.l.google.com:19302"}]},
    con = { 'optional': [{'DtlsSrtpKeyAgreement': true}, {'RtpDataChannels': true }] };

if (ws != null) {
    ws.close();
    ws = null;
}

ws = new WebSocket("ws://localhost:8080/ws");

function logg(s) {
    console.log(s);
}

function connect() {
    if (!conn_started) {
        logg("Starting stuff");
        createPeerConnection();
        conn_started = true;
    } else {
        logg("already connected");
    }
}

function onSignal(message) {
    logg("Sending setup signal");
    ws.send(message);
}

function createPeerConnection() {
    try {
        logg("creating peer connection..");
        peerConn = new RTCPeerConnection(cfg, onSignal);
    } catch (e) {
            logg("Failed to create PeerConnection, exception: " + e.message);
    }
}

/*var notify = function(title, body) {
    var icon = "";
    var perm = window.webkitNotifications.checkPermission();
    if (perm === 0 && title !== '' && body !== '' && usersettings.Notify) { //if auth
        var notification = window.webkitNotifications.createNotification(
            icon,
            title,
            body);
        notification.show();
    } else { //request auth
        window.webkitNotifications.requestPermission();
    }
};*/

ws.onopen = function() {
    logg("ws open");
    connect();
};

ws.onmessage = function(e) {
   logg("RECEIVED: " + e.data);
    if (!started) {
        createPeerConnection();
        started = true;
    }
    // Message returned from other side
    logg('Processing signaling message...');
    peerConn.processSignalingMessage(e.data);

};

ws.onclose = function(e) {
    logg("no ws");
};


