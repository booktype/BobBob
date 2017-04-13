var quickconnect = require('rtc-quickconnect');
var mesh = require('rtc-mesh');
var Doc = require('crdt').Doc;
var uuid = require('uuid');

// initialise the connection
var qc = quickconnect('https://switchboard.rtc.io/', {
  room: 'meshdemo-crdt'
});

// create the model
var model = mesh(qc, { model: new Doc() });

model.on('add', function(row) {
  console.log('new row created: ', row);
});

model.add({ id: uuid.v4(), name: 'Fred' });
