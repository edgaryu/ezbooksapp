const request = require('request');
const querystring = require('querystring');
const validator = require('validator');


var performRequest = function(req, res, next) {

   // Retrieve input from the client
   var clientQueryInput = String(getClientQueryInput((Object.assign({}, req.body))));

   // Check if input is valid
   if (!isValidInput(clientQueryInput)) {
      handleError(req, res);
   };

   // Sanitize the input
   var sanitizedClientQueryInput = sanitizeClientQueryInput(clientQueryInput);

   // Build API query
   var booksAPIRequest = buildAPIRequest(sanitizedClientQueryInput);

   // Send API request to Google Books API
   sendBooksAPIRequest(booksAPIRequest, function(err, response, body) {
      if (err) { console.log(err); return; }

      var result = JSON.parse(body);
      var books = result.items;

      // Parse and store the books in a bookList
      var bookList = [];

      for (var book of books) {
         var bookInfo = book.volumeInfo;
         
         var bookAuthors = bookInfo.authors ? bookInfo.authors : '';
         var bookPublisher = bookInfo.publisher ? bookInfo.publisher : '';
         var bookTitle = bookInfo.title ? bookInfo.title : '';
         var bookImg = bookInfo['imageLinks'] ? bookInfo['imageLinks']['smallThumbnail'] : '';
         var bookMoreInfoLink = bookInfo.infoLink ? bookInfo.infoLink : '';

         // Parse the book authors field
         if (bookAuthors.constructor === Array && bookAuthors.length > 1) {
            bookAuthors = bookAuthors.join(', ');
         }

         var bookObj = {
            'title' : bookTitle,
            'author' : bookAuthors,
            'publisher' : bookPublisher,
            'img' : bookImg,
            'infolink' : bookMoreInfoLink
         };

         bookList.push(bookObj);
      }

      // Send booklist to next middleware- responseController.displayBooks
      req.bookList = bookList;

      next();
   });
};


/**
 * Retrieves the client input from the request body
 * @param {Object} reqBody
 * @returns {string} titleQuery
 */
var getClientQueryInput = function(reqBody) {

   var titleQuery = '';
   if (reqBody.hasOwnProperty('title_query')) {
      titleQuery = reqBody.title_query;
   }
   return titleQuery;
};

/**
 * Checks if the client input is valid
 * @param {string} clientQueryInput
 * @returns {boolean} 
 */
var isValidInput = function(clientQueryInput) {
   return !validator.isEmpty(clientQueryInput);
};

/**
 * Sanitizes the client input
 * @param {string} clientQueryInput
 * @returns {string} queryToSanitize
 */
var sanitizeClientQueryInput = function(clientQueryInput) {
   var queryToSanitize = validator.escape(clientQueryInput);
   validator.trim(queryToSanitize);

   return queryToSanitize;
};

/**
 * Builds a API Request URL with query parameters and options
 * @param {string} clientQueryInput
 * @returns {string} apiQueryURL
 */
var buildAPIRequest = function(clientQueryInput) {
   var baseUrl = "https://www.googleapis.com/books/v1/volumes?";
   var myKey = process.env.GOOGLEBOOKS_APIKEY;

   // CLient provided input
   var clientOptions = {
      'q': clientQueryInput
   }

   // Other request options
   var defaultOptions = {
      'maxResults': 10,
      'key': myKey
   }

   var apiQueryURL = baseUrl + querystring.stringify(clientOptions) + '&' + querystring.stringify(defaultOptions);

   return apiQueryURL;
};

/**
 * Abstraction for requesting a URL
 * @param {string} clientQueryInput
 * @callback requestCallback
 * @returns {string} apiQueryURL
 */
var sendBooksAPIRequest = function(booksAPIRequest, requestCallback) {
   request(booksAPIRequest, requestCallback);
};

var handleError = function(req, res) {
   res.redirect('/',);
};

exports.performRequest = performRequest;
