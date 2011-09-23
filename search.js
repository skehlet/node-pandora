#!/usr/bin/env node

var pandora = require('./pandora');
var _ = require('underscore');

if (process.argv.length != 5) {
  console.log('usage: go.js <username> <password> <query>');
  process.exit(1);
}

var username = process.argv[2];
var password = process.argv[3];
var query = process.argv[4];

pandora.connect(username, password, function(client) {
  client.search(query, function(results) {
    console.log(results);
  });
});
