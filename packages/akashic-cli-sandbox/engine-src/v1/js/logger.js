function enableLogger(game) {
	if (! "console" in window) {
		// 最低限のpolyfillはするがそこまでサポートはしない
		window.console = {
			log: function(x) {
			},
			error: function(x) {
			},
			info: function(x) {
			},
			warn: function(x) {
			}
		};
	}
	var logLevel = g.LogLevel.Debug;
	var loggerMap = {};
	loggerMap[g.LogLevel.Debug] = console.log;
	loggerMap[g.LogLevel.Warn] = console.warn;
	loggerMap[g.LogLevel.Info] = console.info;
	loggerMap[g.LogLevel.Error] = console.error;
	function onLogging(log) {
		if (log.level > logLevel) return;
		var prefix = log.level in g.LogLevel ? "[" + g.LogLevel[log.level].toUpperCase() + "]\t" : "";
		var method = loggerMap[log.level] ? loggerMap[log.level] : console.log;
		method.call(console, prefix + log.message);
		if (log.cause)
			method.call(console, log.cause);
	}
	game.logger.logging.handle(onLogging);
}
