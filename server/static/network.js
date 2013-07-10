var ws;
var conn_started = false;
var peerConn = null;
var dataConn = null;
var attachConnectionListeners = null;
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
        log("Starting stuff");
        createPeerConnection();
        conn_started = true;
    } else {
        log("already connected");
    }
}

function onSignal(message) {
    log("Sending setup signal");
    ws.send(message);
}


function createPeerConnection() {
    try {
        log("_creating_ peer connection..");
        peerConn = new RTCPeerConnection(cfg, onSignal);
        log(peerConn);
        peerConn.onicecandidate = function(e) {
            log("ICE server");
            if (e.candidate) {
                document.localICECandidateForm.localICECandidate.value = JSON.stringify(e.candidate);
            }
        };

        peerConn.onconnection = function(e) {
            log("connected");
        }

        peerConn.createOffer(function(offerDesc) {
            log("Created local offer" + offerDesc);
            peerConn.setLocalDescription(offerDesc);
            ws.send(JSON.stringify(offerDesc));
        }, function() {
            log("Couldn't create offer");
        });

        peerConn.createAnswer(function(answer) {
            log('Created answer.');
            peerConn.setLocalDescription(answer, function() {
                log('Set localDescription to answer.');
            });
        });

        log('listening for data channel..');
        peerConn.ondatachannel = function(evt) {
            log('received data channel !');
        }

        try {
            dataConn = peerConn.createDataChannel('test', {
                reliable: true
            });
            log("create data chan");
            dataConn.onmessage = function(e) {
                log("got message datacon", e.data);
            };
            dataConn.onopen = function(e) {
                log("open datacon", e.data);
            };
        } catch (e) {
            log("No data channel (pc1)" + e);
        }
    } catch (e) {
        log("Failed to create PeerConnection, exception: " + e.message);
    }
}

function sendMessage(s) {
    var channel = new RTCMultiSession();
    channel.send({
        message: s
    });
    return false;
};

ws.onopen = function() {
    log("ws open");
    connect();
};

ws.onmessage = function(e) {
    log("RECEIVED: " + e.data);
    //createPeerConnection();
    log('Processing signaling message...');
    var desc = new RTCSessionDescription(JSON.parse(e.data));
    peerConn.setRemoteDescription(desc);

};

ws.onclose = function(e) {
    log("no ws");
};