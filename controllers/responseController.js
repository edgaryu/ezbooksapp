var displayBooks = function(req, res, next) {

	var bookList = req.bookList;

	res.render('results', { bookList: bookList });
};


exports.displayBooks = displayBooks;