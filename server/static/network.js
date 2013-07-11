var ws;
var conn_started = false;
var peerConn;
var dataConn;
var datacon2;
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

function newConnec(id) {
    createPeerConnection();
    listenICEcandidates();
    setupNegotiationHandler();
    listenDataChan();
    createDataConnection();
}

function createPeerConnection() {
    log("Creating peer Connectin");
    peerConn = new RTCPeerConnection(cfg, {
            optional: [{
                    RtpDataChannels: true
                }
            ]
        });
}

function listenICEcandidates() {
    log("listening ICEcandidates");
    peerConn.onicecandidate = function(e) {
            log("receive ICE server", e);
            //send CANDIDATE to ws
            if (e.candidate) {
                sendMessage(JSON.stringify({ "candidate": evt.candidate }));
            }
        }
}

function listenDataChan() {
    log("listening datachan");
 peerConn.ondatachannel = function(evt) {
    log('Received data channel', evt);
     datacon2 = evt.channel;
     datacon2.onmessage = function(e) {
            log("got message datacon", e);
        };
        datacon2.onopen = function(e) {
            log("open datacon", e);
            datacon2.send("testeeee");
        };
        datacon2.onclose = function (e) {
            log("datacon closed", e);
        }
  };
}

function setupNegotiationHandler() {
  log('Listening for negotiationneeded');
  peerConn.onnegotiationneeded = function() {
   log('`negotiationneeded` triggered');
    //makeOffer();
  };
}

function makeOffer() {
     log('starting create offer...');
    peerConn.createOffer(function(offer) {
        log('Created offer.', offer);
        peerConn.setLocalDescription(offer, function() {
            log('Set localDescription to offer');
           // sendMessage({
           //      type: 'OFFER',
           //      payload: offer
           //  });
        sendMessage(offer);
        }, function(err) {
            log('Failed to setLocalDescription, ', err);
        });
    }, function(err) {
        log('Failed to createOffer, ', err);
    });
}

function createDataConnection() {
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
        dataConn.onclose = function (e) {
            log("datacon closed", e);
        }
    } catch (e) {
        log("No data channel, error " , e);
    }
}

function makeAnswer() {
  peerConn.createAnswer(function(answer) {
    log('Created answer.');
    peerConn.setLocalDescription(answer, function() {
      log('Set localDescription to answer.');
      sendMessage(answer);
    }, function(err) {
      log('Failed to setLocalDescription, ', err);
    });
  }, function(err) {
    log('Failed to create answer, ', err);
  });
}

function handleSDP(sdp, type) {
    //check why must sdp and not sdp.sdp from json..
  sdp = new RTCSessionDescription(sdp);

  peerConn.setRemoteDescription(sdp, function() {
    log('Set remoteDescription: ' , type);
    if (type === 'OFFER') {
      makeAnswer();
    }
  }, function(err) {
    log('Failed to setRemoteDescription, ', err);
  });
}

function sendMessage(s) {
    s  = JSON.stringify(s);
    log("_WS_ Sending : ", s);
   ws.send(s);
};

ws.onopen = function() {
    log("_WS_ open");
    //connect();
};

ws.onmessage = function(e) {
    var jsone = JSON.parse(e.data);
    if (!peerConn) {
        newConnec();
        handleSDP(jsone, 'OFFER');
    } else {
        handleSDP(jsone, 'ANSWER');
    }
};

ws.onclose = function(e) {
    log("_WS_ closed");
};

$(document).ready(function() {
    $("#foo").click(function() {
        newConnec();
        makeOffer();
    });
    $("#bar").click(function(){
        createDataConnection();
    });
});