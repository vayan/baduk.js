var ws;
var conn_started = false;
var peerConn = null;
var dataConn = null;
var cfg = {
    "iceServers": [{
            "url": "stun:stun.l.google.com:19302"
        }
    ]
},
    con = {
        'optional': [{
                'DtlsSrtpKeyAgreement': true
            }, {
                'RtpDataChannels': true
            }
        ]
    };

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
        logg(peerConn);
        peerConn.onicecandidate = function(e) {
            logg("ICE server");
            if (e.candidate) {
                document.localICECandidateForm.localICECandidate.value = JSON.stringify(e.candidate);
            }
        };

        peerConn.onconnection = function(e) {
            logg("connected");
        }

        peerConn.createOffer(function(offerDesc) {
            logg("Created local offer" + offerDesc);
            peerConn.setLocalDescription(offerDesc);
            ws.send(JSON.stringify(offerDesc));
        }, function() {
            logg("Couldn't create offer");
        });

        try {
            dataConn = peerConn.createDataChannel('test', {
                reliable: true
            });
            logg("create data chan");
            dataConn.onmessage = function(e) {
                logg("got message datacon", e.data);
            };
        } catch (e) {
            logg("No data channel (pc1)" + e);
        }
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

function sendMessage(s) {
    var channel = new RTCMultiSession();
    channel.send({message: s});
    return false;
};

ws.onopen = function() {
    logg("ws open");
    connect();
};

ws.onmessage = function(e) {
    logg("RECEIVED: " + e.data);
    //createPeerConnection();
    logg('Processing signaling message...');
    var desc = new RTCSessionDescription(JSON.parse(e.data));
    peerConn.setRemoteDescription(desc);

};

ws.onclose = function(e) {
    logg("no ws");
};