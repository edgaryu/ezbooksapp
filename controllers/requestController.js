const request = require('request');
const querystring = require('querystring');


var performRequest = function(req, res, next) {
   // console.log(req.body.title);

   var clientQueryInput = getClientQueryInput((Object.assign({}, req.body)));
   // var validatedClientQueryInput = validateClientQueryInput(clientQueryInput);
   // var sanitizedClientQueryInput = sanitizeClientQueryInput(validatedClientQueryInput);

   // Build API query
   var booksAPIRequest = buildAPIRequest(clientQueryInput);

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

      return next();

   });
};

var getClientQueryInput = function(reqBody) {
   return 'abc';




};

var buildAPIRequest = function(clientQueryInput) {
   var baseUrl = "https://www.googleapis.com/books/v1/volumes?";
   var myKey = "AIzaSyBHj3jW9DrrJgaGfAVF3-OLiDarvWQUUH8";

   var clientOptions = {
      'q': clientQueryInput
   }

   var defaultOptions = {
      'maxResults': 2,
      'key': myKey
   }

      // var rurl = 'https://www.googleapis.com/books/v1/volumes?q=flowers+inauthor:keyes&maxResults=10&key=' + myKey;

   var apiQueryURL = baseUrl + querystring.stringify(clientOptions) + '?' + querystring.stringify(defaultOptions);

   return apiQueryURL;

};

var sendBooksAPIRequest = function(booksAPIRequest, callback) {
   request(booksAPIRequest, callback);
};

exports.performRequest = performRequest;
