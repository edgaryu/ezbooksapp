# ezbooksapp

A web app that utilizes [Google Books API](https://developers.google.com/books/docs/overview) to search for books. Visit the web app [here](https://ezbooksapp.herokuapp.com/).

## Getting started
Follow these directions to get a local copy running. 

Get your own Google Books API Key [here](https://developers.google.com/books/docs/v1/using) in order to use the API.

Paste your Google Books API Key in the `/googleBooksKey.js` file. In the file, it should then become: `exports.googleBooksKey = '{putyourkeyhere}';`

Install with `npm install`

Then run `npm start`

Visit `http://localhost:3000/` to view the app.

## Built with
- Node
- Express
- Jade
