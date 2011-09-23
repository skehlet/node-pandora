var http = require('http');
var https = require('https');
var querystring = require('querystring');
var _ = require('underscore');

exports.connect = function(username, password, fn) {
  var data = {
    login_username: username,
    login_password: password
  };
  var postData = querystring.stringify(data);
  var options = {
    host: 'www.pandora.com',
    port: 443,
    path: '/login.vm',
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded',
      'Content-length': postData.length
    }
  };

  var req = https.request(options, function(res) {
    // console.log('Status:', res.statusCode);
    // console.log('Headers:', res.headers);

    if (res.statusCode != 200) {
      throw 'Connection failure, got status: ' + res.statusCode;
    }

    _.each(res.headers['set-cookie'], function(cookie) {
      if (cookie.substr(0, 2) == 'at') {
        var pieces = cookie.toString().split(';');
        var pieces2 = pieces[0].split('=');
        var authToken = pieces2[1];
        // console.log('authToken:', authToken);

        var pandora = Pandora(authToken);
        fn(pandora);
      }
    });

    // res.setEncoding('utf-8');
    // var data = '';
    // res.on('data', function(d) {
    //   data += d;
    //   console.log('data', d);
    // });
    // res.on('end', function() {
    //   console.log('end reached, now do something');
    // });
  });

  req.write(postData);
  req.end();
};

function Pandora(authToken) {
  var ajaxApi = function(params, fn) {
    params.at = authToken;
    var options = {
      host: 'www.pandora.com',
      port: 80,
      path: '/services/ajax/?' + querystring.stringify(params)
    };
  
    var data = '';
    var req = http.get(options, function(res) {
      console.log('Status:', res.statusCode);
      console.log('Headers:', res.headers);
      res.setEncoding('utf-8');
      res.on('data', function(d) {
        data += d;
        console.log('data:', d);
      });
      res.on('end', function() {
        console.log('request ended');
        fn(JSON.parse(data));
      });
    });
  };

  return {
    search: function(query, fn) {
      var params = {
        sendquery: 'no',
        q: query
      };
      var options = {
        host: 'www.pandora.com',
        port: 80,
        path: '/autocomplete?' + querystring.stringify(params)
      };
      var req = http.get(options, function(res) {
        var data = '';
        res.setEncoding('utf-8');
        res.on('data', function(chunk) {
          data += chunk;
        });
        res.on('end', function() {
          fn(data);
        });
      });
    },

    add: function(stationId, musicId, fn) {
      ajaxApi({
        bookmarkType: 'stationTrack',
        method: 'bookmark.addBookmark',
        stationID: stationId,
        musicID: musicId
      }, fn)
    }
  };
}
