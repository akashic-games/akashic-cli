var config = {
	autoSendEvents: "init",
	showMenu: true,
	events: {
		init: [[32,0,"dummy",{"type":"start","sessionId":"dummy-id","parameters":{"id": 40571,"totalTimeLimit": 60,"randomSeed":1000}}]]
	},
	arguments: {
		"ex1": {
			"landscape450": {
				"prohibit": false,
				"cascade": false
			},
			"landscape720": {
				"prohibit": false,
				"cascade": false
			},
			"portrait450": {
				"prohibit": true,
				"cascade": false
			}
		},
		"ex2": {
			"landscape450": {
				"prohibit": true,
				"cascade": true
			},
			"landscape720": {
				"prohibit": true,
				"cascade": true
			},
			"portrait450": {
				"prohibit": true,
				"cascade": true
			}
		}
	}
};

for (var i = 0; i < 100; ++i) {
	config.events["ev" + i] = [[32, null, "foo", { data: i }]];
}

module.exports = config;
