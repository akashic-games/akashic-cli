const getPort = require('get-port');

const hostname = "localhost";
let currentPort;

exports.hostname = hostname;
exports.getPort = async () => {
	if (!currentPort) {
		currentPort = await getPort();
	}
	return currentPort;
}
