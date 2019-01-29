var express = require('express');
var router = express.Router();

var request_controller = require('../controllers/requestController'); 
var response_controller = require('../controllers/responseController'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// router.get('/searchRequest/', function(req, res, next) {
// 	console.log('Hi');
// 	console.log(req.body);

// });

router.post('/searchRequest', request_controller.performRequest, response_controller.displayBooks);

module.exports = router;
