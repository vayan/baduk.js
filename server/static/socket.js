//
function Socket () {
    var self = this;
    this.logtype = "_WS_  : "
    this.ws = new WebSocket("ws://localhost:8080/ws");

    this.ws.onopen = function() {
        log(self.logtype+ "Open");
    };

    this.ws.onmessage = function(e) {
        log(self.logtype+ " Received message, ", e.data);
        var jsone = JSON.parse(e.data);
        if (!host) {
            host = new Connection("dssd", self);
            host.handleSDP(jsone, 'OFFER');
        } else {
            host.handleSDP(jsone, 'ANSWER');
        }
    };
    this.ws.onclose = function(e) {
        log(self.logtype+ "Closed");
    };
}

Socket.prototype.send = function(s) {
    s = JSON.stringify(s);
    log(this.logtype+ "Sending : ", s);
    this.ws.send(s);
};