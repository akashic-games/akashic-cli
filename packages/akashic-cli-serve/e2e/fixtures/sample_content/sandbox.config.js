var config = {
    autoSendEvents: "init2",
    showMenu: true,
    events: {
        init: [[32,0,"testid",{"type":"start","sessionId":"dummy-id","parameters":{"id": 40571,"eventParameter": {"quoteContentType": "video"}}}]],
        init2: []
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
 
 
for (var i=0;i<10;i++) {
    config.events.init2.push([32,null,"9999",{"value":"vote","playId":"sandboxDummyPlayId","player":{"id":"9999"}},false]);
}

for (var i = 0; i < 100; ++i) {
    config.events["ev" + i] = [[32, null, "foo", { data: i }]];
}

module.exports = config;
