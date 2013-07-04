var ws;

if (ws != null) {
    ws.close();
    ws = null;
}

ws = new WebSocket("ws://localhost:8080/ws");

var notify = function(title, body) {
    var icon = "../img/icon_notif.jpg";
    var perm = window.webkitNotifications.checkPermission();
    if (perm === 0 && title !== '' && body !== '' && usersettings.Notify) { //si perm
        var notification = window.webkitNotifications.createNotification(
            icon,
            title,
            body);
        notification.show();
    } else { //sinn request perm
        window.webkitNotifications.requestPermission();
    }
};

ws.onopen = function() {
    console.log("ws open");
    ws.send("hi");
};

ws.onmessage = function(e) {
   console.log("message");

};

ws.onclose = function(e) {
    console.log("no ws");
};


