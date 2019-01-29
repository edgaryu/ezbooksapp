var express = require('express');
var router = express.Router();

var request_controller = require('../controllers/requestController'); 
var response_controller = require('../controllers/responseController'); 

/* GET home page. */
router.get('/', function(req, res, next) {

  // If invald input, write an error msg
  if (req && req.invalidInput) {
    req.invalidInput = false;
    res.render('index', {message: 'Invalid input'});
  } else {
    res.render('index');
  }
});

// router.get('/searchRequest/', function(req, res, next) {
//    console.log('Hi');
//    console.log(req.body);

// });

router.post('/search', request_controller.performRequest, response_controller.displayBooks);

module.exports = router;
