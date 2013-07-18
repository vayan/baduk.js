
if (window.mozRTCPeerConnection) {
  var BrowserType = 'Firefox';
} else if (window.webkitRTCPeerConnection) {
  var BrowserType = 'Webkit';
} else {
  var BrowserType = 'Unknown';
}

var RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
var RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.RTCPeerConnection;