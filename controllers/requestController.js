const request = require('request');
const querystring = require('querystring');

var validator = require('validator');


var performRequest = function(req, res, next) {
   // console.log(req.body.title);

   var clientQueryInput = String(getClientQueryInput((Object.assign({}, req.body))));

   // If input not valid, send error
   if (!isValidInput(clientQueryInput)) {
      handleError(req, res);
   };

   var sanitizedClientQueryInput = sanitizeClientQueryInput(clientQueryInput);

   // Build API query
   var booksAPIRequest = buildAPIRequest(sanitizedClientQueryInput);

   sendBooksAPIRequest(booksAPIRequest, function(err, response, body) {
      if (err) { console.log(err); return; }
      // console.log("Get response: " + response.statusCode);

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

var getClientQueryInput = function(reqBody) {
   // return 'abc';

   var titleQuery = '';
   if (reqBody.hasOwnProperty('title_query')) {
      titleQuery = reqBody.title_query;
   }
   return titleQuery;
};

var isValidInput = function(clientQueryInput) {
   return !validator.isEmpty(clientQueryInput);
};

var sanitizeClientQueryInput = function(clientQueryInput) {
   var queryToSanitize = validator.escape(clientQueryInput);
   validator.trim(queryToSanitize);

   return queryToSanitize;
};

var buildAPIRequest = function(clientQueryInput) {
   var baseUrl = "https://www.googleapis.com/books/v1/volumes?";
   var myKey = "AIzaSyBHj3jW9DrrJgaGfAVF3-OLiDarvWQUUH8";

   var clientOptions = {
      'q': clientQueryInput
   }

   var defaultOptions = {
      'maxResults': 3,
      'key': myKey
   }

      // var rurl = 'https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&maxResults=10&key=' + myKey;

   var apiQueryURL = baseUrl + querystring.stringify(clientOptions) + '&' + querystring.stringify(defaultOptions);

   console.log(apiQueryURL);

   return apiQueryURL;

};

var sendBooksAPIRequest = function(booksAPIRequest, callback) {
   request(booksAPIRequest, callback);
};

var handleError = function(req, res) {
   res.redirect('/',);
};

exports.performRequest = performRequest;
