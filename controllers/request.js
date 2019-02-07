const querystring = require('querystring');
const request = require('request');

const apiKey = require('../googleBooksKey').googleBooksKey;

class APIOptions {
	constructor() {
		this.clientOptions = {};
		this.defaultOptions = {};
	}

	addClientOptions(options) {
		Object.assign(this.clientOptions, options);
	}

	addDefaultOptions(options) {
		Object.assign(this.defaultOptions, options);
	}

	getClientOptions() {
		return this.clientOptions;
	}

	getDefaultOptions() {
		return this.defaultOptions;
	}	
}

class APIRequest {
	constructor(url, options) {
		this.baseURL = url;
		this.apiOptions = options;
		this.requestURL = '';
		this.buildRequestUrl();
	}

	buildRequestUrl() {
		const clientOptionsStr = querystring.stringify(this.apiOptions.getClientOptions());
		const defaultOptionsStr = querystring.stringify(this.apiOptions.getDefaultOptions());

		this.requestURL = this.baseURL + clientOptionsStr + '&' + defaultOptionsStr;
	}

	getRequestURL() {
		return this.requestURL;
	}

	sendRequest() {
		var timeOutLength = 2000;
		return request(this.requestURL, {timeout: timeOutLength}, requestCallback);
	}




	// buildAPIRequest(clientQueryInput) {
	//    var baseUrl = "https://www.googleapis.com/books/v1/volumes?";
	//    var myKey = process.env.GOOGLEBOOKS_APIKEY || apiKey;

	//    // CLient provided input
	//    var clientOptions = {
	//       'q': clientQueryInput
	//    }

	//    // Other request options
	//    var defaultOptions = {
	//       'maxResults': 10,
	//       'key': myKey
	//    }

	//    var apiQueryURL = baseUrl + querystring.stringify(clientOptions) + '&' + querystring.stringify(defaultOptions);

	//    return apiQueryURL;
	// };	
	
}

// class GoogleBooksAPIRequest extends APIRequest{
// 	constructor(url) {
// 		super(url);
// 	}
// }


// var thisreq = new GoogleBooksAPIRequest(url, options);

// var opt = new APIOptions();
// opt.addClientOptions({'q': 'abcquery'});
// opt.addDefaultOptions({'maxResults': 10, 'key': 'thisismykey'});

// var newr = new APIRequest('google.com?', opt);
// console.log(newr.getRequestURL());
