var ws;
var conn_started = false;
var peerConn;
var dataConn;
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

function connect() {
    log("Starting stuff");
    createPeerConnection();
}

function onSignal(message) {
    log("Sending setup signal");
   sendMessage(message);
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
};


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
};

function createPeerConnection(isServer) {
    try {
        log("_creating_ peer connection..");
        peerConn = new RTCPeerConnection(cfg, {
            optional: [{
                    RtpDataChannels: true
                }
            ]
        });
        //log(peerConn);

        dataConn = peerConn.createDataChannel('test', {
           reliable: true
        })
        log("create data chan");
        dataConn.onmessage = function(e) {
            log("got message datacon", e.data);
        };
        dataConn.onopen = function(e) {
            log("open datacon", e.data);
        };


          peerConn.onicecandidate = function(e) {
            log("receive ICE server", e);
            //send CANDIDATE to ws
            if (e.candidate) {
                sendMessage(JSON.stringify({ "candidate": evt.candidate }));
            }
        }
        
        peerConn.oniceconnectionstatechange = function() {
            if ( !! self.pc && self.pc.iceConnectionState === 'disconnected') {
                log('iceConnectionState is disconnected');
            }
        };
        peerConn.onconnection = function(e) {
            log("connected");
        }

        peerConn.ondatachannel = function(evt) {
            log('received data channel !');
        }

        if (isServer)
            makeOffer();
        //else
          //makeAnswer();

      

    
    } catch (e) {
        log("Failed to create PeerConnection, error: ", e.message);
    }
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
    if (!peerConn) {
        createPeerConnection(false);
    }

    log("_WS_ RECEIVED: ", e);
    var jsone = JSON.parse(e.data);

    if (jsone.sdp) {
        log('Added remote descr');
        peerConn.setRemoteDescription(new RTCSessionDescription(jsone.sdp), function(){
            makeAnswer();
        });
    } 
    else {
        log('Added ICE candidate.');
        peerConn.addIceCandidate(new RTCIceCandidate(jsone.candidate));
    }
};

ws.onclose = function(e) {
    log("_WS_ closed");
};

$(document).ready(function() {
    $("#foo").click(function() {
        createPeerConnection(true);
    });
});