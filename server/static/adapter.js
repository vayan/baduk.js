var exports = this;

if (window.mozRTCPeerConnection) {
  var BrowserType = 'Firefox';
} else if (window.webkitRTCPeerConnection) {
  var BrowserType = 'Webkit';
} else {
  var BrowserType = 'Unknown';
}

exports.RTCSessionDescription = window.mozRTCSessionDescription || window.RTCSessionDescription;
exports.RTCPeerConnection = window.mozRTCPeerConnection || window.webkitRTCPeerConnection || window.RTCPeerConnection;