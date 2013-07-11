var ws;
var peerConn;
var dataConn;
var dataConn2;
var logtype = "*NETWORK* : ";

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

function newConnection(id) {
    createPeerConnection();
    listenICEcandidates();
    listenDataChan();
    createDataConnection();
}

function createPeerConnection() {
    log(logtype+ "Creating RTCPeerConnection");
    peerConn = new RTCPeerConnection(cfg, {
        optional: [{
                RtpDataChannels: true
            }
        ]
    });
}

function listenICEcandidates() {
    log(logtype+ "Listening for ICEcandidates");
    peerConn.onicecandidate = function(e) {
        log(logtype+ "Received ICE server, ", e);
        if (e.candidate) {
            sendMessage(JSON.stringify({
                "candidate": evt.candidate
            }));
        }
    }
}

function listenDataChan() {
    log(logtype+ "Listening for datachannel");
    peerConn.ondatachannel = function(evt) {
        log(logtype+ 'Received datachannel, ', evt);
        dataConn2 = evt.channel;
        dataConn2.onmessage = function(e) {
            log(logtype+ "got message datacon", e);
        };
        dataConn2.onopen = function(e) {
            log(logtype+ "open datacon", e);
        };
        dataConn2.onclose = function(e) {
            log(logtype+ "datacon closed", e);
        }
    };
}

function makeOffer() {
    log(logtype+ 'Starting to create offer...');
    peerConn.createOffer(function(offer) {
        log(logtype+ 'Offer created, ', offer);
        peerConn.setLocalDescription(offer, function() {
            log(logtype+ 'Set localDescription to offer');
            // sendMessage({
            //      type: 'OFFER',
            //      payload: offer
            //  });
            sendMessage(offer);
        }, function(err) {
            log(logtype+ 'Failed to setLocalDescription, ', err);
        });
    }, function(err) {
        log(logtype+ 'Failed to createOffer, ', err);
    });
}

function createDataConnection() {
    try {
        dataConn = peerConn.createDataChannel('test', {
            reliable: true
        });
        log(logtype+ "Create DataChannel");
        dataConn.onmessage = function(e) {
            log(logtype+ "got message datacon", e.data);
        };
        dataConn.onopen = function(e) {
            log(logtype+ "open datacon", e.data);
        };
        dataConn.onclose = function(e) {
            log(logtype+ "datacon closed", e);
        }
    } catch (e) {
        log(logtype+ "Error DataChannel, ", e);
    }
}

function makeAnswer() {
    peerConn.createAnswer(function(answer) {
        log(logtype+ 'Created answer');
        peerConn.setLocalDescription(answer, function() {
            log(logtype+ 'Set localDescription to answer');
            sendMessage(answer);
        }, function(err) {
            log(logtype+ 'Failed to setLocalDescription, ', err);
        });
    }, function(err) {
        log(logtype+ 'Failed to create answer, ', err);
    });
}

function handleSDP(sdp, type) {
    //check why must sdp and not sdp.sdp from json..
    sdp = new RTCSessionDescription(sdp);

    peerConn.setRemoteDescription(sdp, function() {
        log(logtype+ 'Set RemoteDescription, ', type);
        if (type === 'OFFER') {
            makeAnswer();
        }
    }, function(err) {
        log(logtype+ 'Failed to setRemoteDescription, ', err);
    });
}

function sendMessage(s) {
    s = JSON.stringify(s);
    log(logtype+ " _WS_ Sending : ", s);
    ws.send(s);
};

ws.onopen = function() {
    log(logtype+ "_WS_ Open");
    //connect();
};

ws.onmessage = function(e) {
    log(logtype+ " _WS_ Received message, ", e.data);
    var jsone = JSON.parse(e.data);
    if (!peerConn) {
        newConnection();
        handleSDP(jsone, 'OFFER');
    } else {
        handleSDP(jsone, 'ANSWER');
    }
};

ws.onclose = function(e) {
    log(logtype+ " _WS_ Closed");
};

$(document).ready(function() {
    $("#start").click(function() {
        newConnection();
        makeOffer();
    });
    $("#send").click(function() {
        dataConn.send($("#msg").val());
        dataConn2.send($("#msg").val());
    });
});