#!/usr/bin/env node

var pandora = require('./pandora');
var _ = require('underscore');

if (process.argv.length != 6) {
  console.log('usage: go.js <username> <password> <stationId> <musicId>');
  process.exit(1);
}

var username = process.argv[2];
var password = process.argv[3];
var stationId = process.argv[4];
var musicId = process.argv[5];

pandora.connect(username, password, function(client) {
  client.add(stationId, musicId, function(results) {
    console.log(results);
  });
});
