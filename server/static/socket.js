//

function Socket() {
    var self = this;
    this.logtype = "_WS_  : "
    this.ws = new WebSocket("ws://localhost:8080/ws");

    this.ws.onopen = function() {
        log(self.logtype + "Open");
        if (uri) {
            socket.send({
                "Key": "SETKEY",
                "Uri": uri,
                "Data": ""
            });
        }
    };

    this.ws.onmessage = function(e) {
        log(self.logtype + " Received message, ", e.data);
        var jsone = JSON.parse(e.data);

        switch (jsone.Key) {
            case 'NEW':
                host = new Connection(uri, socket);
                host.makeOffer();
                break;
            case 'OFFER':
                host = new Connection(jsone.Uri, self);
                host.handleSDP(JSON.parse(jsone.Data), 'OFFER');
                break;
            case 'ANSWER':
                host.handleSDP(JSON.parse(jsone.Data), 'ANSWER');
                break;
        }
    };
    this.ws.onclose = function(e) {
        log(self.logtype + "Closed");
    };
}

Socket.prototype.close = function() {
    this.ws.close();
};

Socket.prototype.send = function(s) {
    s = JSON.stringify(s);
    log(this.logtype + "Sending : ", s);
    this.ws.send(s);
};