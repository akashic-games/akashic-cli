const hostname = "localhost";
const port = 12345;
const socket = io(`ws://${hostname}:${port}`);

exports.hostname = hostname;
exports.port = port;
exports.socket = socket;
