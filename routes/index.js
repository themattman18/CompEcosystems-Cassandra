var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/matt', function(req, res, next) {
  res.render('index', { title: 'Matt' });
});

router.post('/vote', function (req, res) {

  var tls = require('tls');
  var fs = require('fs');

  var ssl_option = {
    cert : fs.readFileSync("bc2025new.cer"),
    secureProtocol: 'TLSv1_2_method'
  };
  var cassandra = require('cassandra-driver')
  var authProvider = new cassandra.auth.PlainTextAuthProvider('<userName>', '<password>');

  var client = new cassandra.Client({
      contactPoints: ['<database>'],  
      authProvider: authProvider,
      sslOptions:ssl_option,
  });

    var vote = req.param('vote');
    var voteid = parseInt( Math.random() * 1000);

    // This is wide open to sql injection
    var query = "INSERT INTO  test.vote  (voteid, vote) VALUES (" + voteid + ", '" + vote + "')";
     //var params = [1, 'pizza'];
 

    client.execute(query, function (test) {
      console.log('Row inserted on the cluster');
    });
    
  res.send(vote);
});


router.get('/getvotes', function (req, res) {

  var tls = require('tls');
  var fs = require('fs');

  var ssl_option = {
    cert : fs.readFileSync("bc2025new.cer"),
    secureProtocol: 'TLSv1_2_method'
  };
  var cassandra = require('cassandra-driver')
  var authProvider = new cassandra.auth.PlainTextAuthProvider('<userName>', '<password>');

  var client = new cassandra.Client({
      contactPoints: ['<database>'], 
      //keyspace: 'test', 
      authProvider: authProvider,
      sslOptions:ssl_option,
  });

  var query = 'SELECT * FROM test.vote';
  var results = [];

 
    client.execute(query,  function (err, result) {
      
    
      if (err) throw err;
      result.rows.forEach(function(row) {
        results.push(row.vote);
      }, this);

      res.send(results);
    });


});

module.exports = router;