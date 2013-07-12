//

function Connection(id, socket) {
    this.id = id;
    this.pc;
    this.dc;
    this.dc2;
    this.logtype = "*NETWORK* : ";
    this.ws = socket;
    this.cfg = {
        "iceServers": [{
            "url": "stun:stun.l.google.com:19302"
        }]
    },
    con = {
        'optional': [{
            'DtlsSrtpKeyAgreement': true
        }, {
            'RtpDataChannels': true
        }]
    };
    this.createPeerConnection();
    this.listenICEcandidates();
    this.listenDataChan();
    this.dc = this.createDataConnection();
}

Connection.prototype.setID = function() {
    var self = this;
    log(this.logtype + "Setting id");
    self.ws.send({
            "Key": "SETKEY",
            "Uri": self.id,
            "Data": ""
    });
};

Connection.prototype.createPeerConnection = function() {
    var self = this;
    log(this.logtype + "Creating RTCPeerConnection");
    this.pc = new RTCPeerConnection(self.cfg, {
        optional: [{
            RtpDataChannels: true
        }]
    });
};

Connection.prototype.listenICEcandidates = function() {
    var self = this;
    log(this.logtype + "Listening for ICEcandidates");
    this.pc.onicecandidate = function(e) {
        log(self.logtype + "Received ICE server, ", e);
        log(self.logtype + '[c="color: red"]you can share the url[c]');
        if (e.candidate) {
            self.ws.send({
                "Key": "CANDIDATE",
                "Uri": self.id,
                "Data": JSON.stringify({
                    "candidate": evt.candidate
                })
            });
        }
    }
};

Connection.prototype.listenDataChan = function() {
    var self = this;
    log(this.logtype + "Listening for datachannel");
    this.pc.ondatachannel = function(evt) {
        log(self.logtype + 'Received datachannel, ', evt);
        self.dc2 = self.createDataConnection(evt.channel);
    };
};

Connection.prototype.makeAnswer = function() {
    var self = this;
    this.pc.createAnswer(function(answer) {
        log(self.logtype + 'Created answer');
        self.pc.setLocalDescription(answer, function() {
            log(self.logtype + 'Set localDescription to answer');
            self.ws.send({
                "Key": "ANSWER",
                "Uri": self.id,
                "Data": JSON.stringify(answer)
            });
        }, function(err) {
            log(self.logtype + 'Failed to setLocalDescription, ', err);
        });
    }, function(err) {
        log(self.logtype + 'Failed to create answer, ', err);
    });
};

Connection.prototype.makeOffer = function() {
    var self = this;
    log(this.logtype + 'Starting to create offer...');
    this.pc.createOffer(function(offer) {
        log(self.logtype + 'Offer created, ', offer);
        self.pc.setLocalDescription(offer, function() {
            log(self.logtype + 'Set localDescription to offer');
            self.ws.send({
                "Key": "OFFER",
                "Uri": self.id,
                "Data": JSON.stringify(offer)
            });
        }, function(err) {
            log(self.logtype + 'Failed to setLocalDescription, ', err);
        });
    }, function(err) {
        log(self.logtype + 'Failed to createOffer, ', err);
    });
};

Connection.prototype.handleSDP = function(sdp, type) {
    var self = this;
    //check why must sdp and not sdp.sdp from json..
    sdp = new RTCSessionDescription(sdp);

    this.pc.setRemoteDescription(sdp, function() {
        log(self.logtype + 'Set RemoteDescription, ', type);
        if (type === 'OFFER') {
            self.makeAnswer();
        }
    }, function(err) {
        log(self.logtype + 'Failed to setRemoteDescription, ', err);
    });
};

Connection.prototype.createDataConnection = function(dc) {
    var self = this;
    try {
        if (!dc) {
            dc = self.pc.createDataChannel('test', {
                reliable: true
            });
        }
        log(self.logtype + "Create DataChannel");
        dc.onmessage = function(e) {
            log(self.logtype + "got message datacon", e.data);
        };
        dc.onopen = function(e) {
            log(self.logtype + "Open datacon", e.data);
            self.ws.close();
        };
        dc.onclose = function(e) {
            log(self.logtype + "datacon closed", e);
        }
    } catch (e) {
        log(self.logtype + "Error DataChannel, ", e);
    }
    return dc;
};