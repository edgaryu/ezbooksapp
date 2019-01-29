var express = require('express');
var router = express.Router();

var request_controller = require('../controllers/requestController'); 
var response_controller = require('../controllers/responseController'); 

// GET endpoint for Home page
router.get('/', function(req, res, next) {
   res.render('index');
});


// POST endpoint to process search form
router.post('/', request_controller.performRequest, response_controller.displayBooks);

module.exports = router;
