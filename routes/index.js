
/*
 * GET home page.
 */

/*eslint-env node */
var constants = require('./constants');

// Create the service wrapper

exports.index = function(req, res){
	
  res.render('index.ejs', { title: constants.TITLE });
};