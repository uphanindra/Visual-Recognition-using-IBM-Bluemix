/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express'),
	routes = require('./routes'),
	path = require('path'),
	util = require('util'),
	ibmdb = require('ibm_db'),
	changeCase = require('change-case'),
	watson = require('watson-developer-cloud'),
	fs = require('fs'),
	constants = require('./routes/constants');
// create a new express server
var app = express();

// create http request
var http = require('http');


var bodyParser = require('body-parser');
//var methodOverride = require('method-override');
var logger = require('morgan');
//var errorHandler = require('errorhandler');
//var multipart = require('connect-multiparty');
//var multipartMiddleware = multipart();


var visual_recognition, params;
var ONE_HOUR = 3600000;
var CLASSIFIERID = [];
// serve the files out of ./public as our main files
//app.use(express.static(__dirname + '/public'));
//var upload = multer({ dest: './uploads/' });
//var busboy = require('connect-busboy');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(logger('dev'));
//app.use(busboy()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));
app.use('/images', express.static(path.join(__dirname, '/public')));


//Web page constants
app.set('title','Insured with RAD');

  var env = null;  
  var key = -1;  
  var db2creds=null;  
  if (process.env.VCAP_SERVICES) {  
     env = JSON.parse(process.env.VCAP_SERVICES);  
     key = findKey(env,'SQLDB');  
  }  
  
  db2creds = env[key][0].credentials;  
  
   var connString = "DRIVER={DB2};DATABASE=" + db2creds.db + ";UID=" + db2creds.username + ";PWD=" + db2creds.password + ";HOSTNAME=" + db2creds.hostname + ";port=" + db2creds.port;  
  
  //console.log('db2creds:'+db2creds);  
  console.log('connString:'+connString);  




function initWatsonConnection() {
	
  visual_recognition = watson.visual_recognition({
  	version: 'v2-beta',
  	username: '<username>',
  	password: '<password>',
  	version_date:'2015-12-02'
  	});

}

initWatsonConnection();


app.get('/', routes.index);


app.post('/api/insurerDemo', /* @callback */ function(req, res, next) {
	
	res.render('insurerIndex',{title:constants.TITLE2});
	
});


app.post('/api/insuredDemo', /* @callback */ function(req, res, next) {

	params = {
	name: constants.DRIVERNAME,
	positive_examples: fs.createReadStream('./public/phanindra.zip'),
	negative_examples: fs.createReadStream('./public/nag.zip')
	};
	
	visual_recognition.createClassifier(params, function(err, classifier) {
   	 if (err){  	 	
   	 
      	console.log(err);
      	res.render('showError',{title:constants.TITLE1,
	    							err:'Something went wrong!'
									});
  	 }

     else{
     	console.log(JSON.stringify(classifier, null, 2));
     	// deletes the classifier after an hour
          setTimeout(
            visual_recognition.deleteClassifier.bind(visual_recognition, classifier),
            ONE_HOUR);
         // classifier_id = classifier.classifier_id;
		//res.json(classifier);
		//app.set('classifier_id',classifier.classifier_id);
		CLASSIFIERID.push(classifier.classifier_id);
		console.log(CLASSIFIERID);
		//res.writeHead(200,{"Content-Type":"text/html"});
		//fs.createReadStream('./views/showClassify.html').pipe(res);
		res.render('insuredIndex',{title:constants.TITLE1,
							user:constants.USER});
		
     }
   		
	});
	
});


var img_classify;
app.post('/api/classify1', function(req, res, next) {
	
	console.log('in classify 1 - Known');
	img_classify = fs.createReadStream('./public/test.jpg');
	console.log('Classifier: '+CLASSIFIERID);
	setTimeout (process_image(req,res,next), 3000);
	
	
});
app.post('/api/classify2', function(req, res, next) {
	
	console.log('in classify 2 - unknown');
	img_classify =  fs.createReadStream('./public/test1.jpg');
	console.log('Classifier: '+CLASSIFIERID);
	setTimeout (process_image(req,res,next), 3000);
	
});

function process_image(req,res,next){
	console.log('In process_image');
	//console.log('img_path: '+img_path);
	var parm = {
    images_file: img_classify,
//    images_file: fs.createReadStream(req.files.driver.path),
    classifier_ids: CLASSIFIERID
  	};

  visual_recognition.classify(parm, function(err, results) {
    var driverName,driverScore,driverId,driver;
    
    if (err){
      console.log(err);
      res.render('showError',{title:constants.TITLE1,
	    							err:'Something went wrong while classifying image!'
									});
  	}

    else{
    
    	console.log(JSON.stringify(results, null, 2));
    	//res.json(results); 
    	console.log(filterUserCreatedClassifier(results, parm.classifier_ids));
    	//res.json(filterUserCreatedClassifier(results, parm.classifier_ids));
    	if (results && results.images) {
   		 results.images.forEach(function(image) {
    	console.log('Image : ' + image.image);
    	console.log('Score is Array  : ' + util.isArray(image.scores));
    	
     	 if (util.isArray(image.scores)){
    	
    		image.scores.forEach(function(score) {
    			
    			driverName = score.name.trim();
    			driverScore = score.score;
    			if(driverName == constants.DRIVERNAME.toString().trim()){
    				driverId = constants.DRIVERID;
    				
    			}
    			else{
    				res.render('showError',{title:constants.TITLE1,
	    							err:'Something went wrong while classifying image!'
									});
    			}
    			
    			
    		});
        }
        else{
        	driverName = constants.UNKNOWN_DRIVER;
    		driverScore = 0;
    		driver  = driverName.split('-');
    		driverId = driver[0];
    		driverName = driver[1];
    		
    	    }
       
   		  });
 	 	 }
    			
		console.log('DRIVER ID:' + driverId);
		console.log('DRIVER NAME:' + driverName); 
  		console.log('Score-:'+driverScore);
  		  		
  		res.render('displayDriver',{title: constants.TITLE1,
  									policyNum: constants.POLICY_NUM,
									driverName: changeCase.upperCaseFirst(driverName),
									driverId: driverId,
									score: driverScore
									});
	
    }
      
  });

}

/**
 * Filter users created classifier from 'result'. If 'classifier_ids' is specified
 * they won't be filtered
 * @param  {Object} result        The result of calling 'classify()'
 * @param  {Array} classifier_ids The user created classifier ids
 * @return {Object}               The filtered 'result'
 */
function filterUserCreatedClassifier(result, classifier_ids) {
  var ids = classifier_ids || [];
  if (result && result.images) {
    result.images.forEach(function(image) {
      if (util.isArray(image.scores))
        image.scores = image.scores.filter(function (score) {
          // IBM's classifiers have the id = name
          return (score.classifier_id === score.name) ||
                 (ids.indexOf(score.classifier_id) !== -1);
        });
    });
  }
  return result;
}



// get DB2 SQLDB service information  
  function findKey(obj,lookup) {  
    for (var i in obj) {  
     if (typeof(obj[i])==="object") {  
       if (i.toUpperCase().indexOf(lookup) > -1) {  
        // Found the key  
        return i;  
       }  
       findKey(obj[i],lookup);  
     }  
    }  
    return -1;  
  }
  
app.post('/api/data', function(req, res, next) {
	
	var driverId = req.body.drvId;
	var driverName = req.body.drvName;
	
	var dayMiles = req.body.dayMiles;
	var nightMiles = req.body.nightMiles;
	var avgSpeed = req.body.avgSpeed;
	var harshBreaks = req.body.harshBreaks;
	var harshTurns = req.body.harshTurns;
	
	var select_query = "SELECT * FROM RAD_MAIN WHERE DRIVER_ID='" + driverId + "'" ;
	
	console.log('in api/data');
	console.log('driverId: '+driverId);
	console.log('driverName: '+driverName);
	console.log('dayMiles: '+dayMiles);
	console.log('nightMiles: '+nightMiles);
	console.log('avgSpeed: '+avgSpeed);
	console.log('harshBreaks: '+harshBreaks);
	console.log('harshTurns: '+harshTurns);
	console.log('Query: '+select_query);
	console.log('Opening DB Connetion');
	
	
/* ibmdb open */
	ibmdb.open(connString, function (err,conn) {
	  if (err) {
	  	console.log(err);
	  	//res.status(500).send('Something went wrong with Database conncetivity!');
	  	res.render('showError',{title:constants.TITLE1,
	    							err:'Something went wrong with Database conncetivity!'
									});
		}

	  conn.query(select_query, function (err, data) {
	    if (err) {
	  	console.log(err);
	  	//res.status(500).send('Something went wrong while reading database!!');
	  	res.render('showError',{title:constants.TITLE1,
	    							err:'Something went wrong while reading database!'
									});
		}
	    else {
	    	//res.status(200).send(driverName.toUpperCase() + " has driven " + user_miles + " miles!!");
	    	
			if (data.length == 0 ){
				console.log('Driver is not found in database');
 		 		console.log('DRIVER ID: '+driverId);
 		 		console.log('DRIVER NAME: '+driverName);
 		 			
				//res.status(200).send('Driver '+driverName+' not found in Database. Please add driver to Policy!!');
				
				res.render('showError',{title:constants.TITLE1,
	    							err:'Driver '+driverName+' not found in Database. Please add driver to Policy!!'
									});
				
			}
			else{
				
				for (var i = 0; i < data.length; i++){
				
					console.log('Driver found in database');
					console.log('DRIVER ID: '+driverId);
					console.log('DRIVER NAME: '+driverName);
					
					var existingTotMiles = parseInt(data[i].DAY_MILES, 10) + parseInt(data[i].NIGHT_MILES, 10);
					
					var existingSpeedVsMiles = parseInt(existingTotMiles, 10) * parseInt(data[i].AVG_SPEED, 10);

					var newTotalMiles = parseInt(dayMiles, 10) + parseInt(nightMiles, 10);
					var newSpeedVsMiles = parseInt(newTotalMiles, 10) * parseInt(avgSpeed, 10);
					
					
 		 			var dayMilesTmp = parseInt(dayMiles, 10) + parseInt(data[i].DAY_MILES, 10);
 		 			var nightMilesTmp = parseInt(nightMiles, 10) + parseInt(data[i].NIGHT_MILES, 10);
 		 			//var avgSpeedTmp = parseInt(avgSpeed) + parseInt(data[i].AVG_SPEED);
 		 			
 		 			var harshBreaksTmp = parseInt(harshBreaks, 10) + parseInt(data[i].HARSH_BREAKS, 10);
 		 			var harshTurnsTmp = parseInt(harshTurns, 10) + parseInt(data[i].HARSH_TURNS, 10);
 		 			
 		 			var avgSpeedTmp = (parseInt(existingSpeedVsMiles, 10) + parseInt(newSpeedVsMiles, 10)) / (parseInt(existingTotMiles, 10) + parseInt(newTotalMiles, 10));
 		 			
 		 			console.log('new avg speed: '+avgSpeedTmp);	
 		 			
 		 			
 		 			var update_query = "UPDATE RAD_MAIN SET DAY_MILES = " + dayMilesTmp 
 		 								+ ",NIGHT_MILES = " + nightMilesTmp
 		 								+ ",AVG_SPEED = " + avgSpeedTmp
 		 								+ ",HARSH_BREAKS = " + harshBreaksTmp
 		 								+ ",HARSH_TURNS = " + harshTurnsTmp
 		 								+ " WHERE DRIVER_ID='" + driverId + "'" ;
 		 								
 		 			
	
					console.log('update_query: '+update_query);	
					
					conn.query(update_query, function (err, data) {
						
						if (err) {
						  	console.log(err);
							console.log('Something went wrong while updating database!!!');
						  	//res.status(500).send('Something went wrong with Database conncetivity!');
						  	res.render('showError',{title:constants.TITLE1,
						    							err:'Something went wrong with Database conncetivity!'
														});
							}
						else{
							console.log('Succesfull DB Update!!');
						  	res.render('successful',{title:constants.TITLE1,
	    							user:changeCase.upperCaseFirst(driverName)
									});
						}
						
					});
 		 		

				}			
				
			}

		} /*End of successful query*/

	    conn.close(function () {
	      console.log('done - DB Connection closed!');
	    });
	  });
	});
	
	/*ibmdb end of open */
});



app.post('/api/displayTerm', function(req, res, next) {
	
	var policyNum = req.body.policyNum.toUpperCase();
		
	var select_query = "SELECT DISTINCT START_DATE,STOP_DATE FROM RAD_MAIN WHERE POLICY# ='" + policyNum + "' ORDER BY START_DATE,STOP_DATE" ;
	
	console.log('in api/displayTerm');
	console.log('policyNum: '+policyNum);
	console.log('Query: '+select_query);
	console.log('Opening DB Connetion');
	
	
/* ibmdb open */
	ibmdb.open(connString, function (err,conn) {
	  if (err) {
	  	console.log(err);
	  	//res.status(500).send('Something went wrong with Database conncetivity!');
	  	res.render('showError',{title:constants.TITLE2,
	    							err:'Something went wrong with Database connectivity!'
									});
		}

	  conn.query(select_query, function (err, data) {
	    if (err) {
	  	console.log(err);
	  	//res.status(500).send('Something went wrong while reading database!!');
	  	res.render('showError',{title:constants.TITLE2,
	    							err:'Something went wrong while reading database!'
									});
		}
	    else {
	    	
			if (data.length == 0 ){
				console.log('Policy is not found in database');
 		 		console.log('Policy Number: '+policyNum);
 		 			
				res.render('showError',{title:constants.TITLE2,
	    							err:'Policy '+policyNum+' is not found in Database!!'
									});
				
			}
			else{
				console.log('Policy found in database');
				console.log('Policy Number: '+policyNum);
						
				console.log('DATA:'+JSON.stringify(data, null, 2));
				res.render('showTerm',{title:constants.TITLE2,
	    							data: data,
	    							policyNum: policyNum
									});	
			}

		} /*End of successful query*/

	    conn.close(function () {
	      console.log('done - DB Connection closed!');
	    });
	  });
	});
	
	/*ibmdb end of open */
});


app.post('/api/displayPrem', function(req, res, next) {
	
	console.log('Processing Post api./displayPrem');
	var term = req.body.term;
	var policyNum = req.body.policyNum;
	
	var termDate  = term.split('to');
    var startDate = termDate[0].trim();
    var stopDate = termDate[1].trim();
    
    console.log('Term Start Date: ' + startDate);
    console.log('Term Stop Date: ' + stopDate);
	console.log('policyNum: ' + policyNum);
	
    
	var select_query = "SELECT * FROM RAD_MAIN WHERE POLICY# ='" + policyNum + "' AND START_DATE = '" + startDate + "' AND STOP_DATE = '" + stopDate + "' ORDER BY DRIVER_RATE" ;
	
	console.log('Query: '+select_query);
	console.log('Opening DB Connetion');
	
	
/* ibmdb open */
	ibmdb.open(connString, function (err,conn) {
	  if (err) {
	  	console.log(err);
	  	//res.status(500).send('Something went wrong with Database conncetivity!');
	  	res.render('showError',{title:constants.TITLE2,
	    							err:'Something went wrong with Database connectivity!'
									});
		}

	  conn.query(select_query, function (err, data) {
	    if (err) {
	  	console.log(err);
	  	//res.status(500).send('Something went wrong while reading database!!');
	  	res.render('showError',{title:constants.TITLE2,
	    							err:'Something went wrong while reading database!'
									});
		}
	    else {
	    	
			if (data.length == 0 ){
				console.log('Policy is not found in database');
 		 		console.log('Policy Number: '+policyNum);
 		 			
				res.render('showError',{title:constants.TITLE2,
	    							err:'Policy '+policyNum+' is not found in Database!!'
									});
				
			}
			else{
				console.log('Policy found in database');
				console.log('Policy Number: '+policyNum);
				
				
				/* Determining risk rate*/
				
				var AccurateRisk = 0, PolicyRisk = 0,DriverRisk = 0, TotalMiles = 0, DriverMiles = 0, ActualPremium = 0;
				var PreDeterminedRisk = parseFloat(constants.PRE_DETERMINED_RISK);
				var PreDeterminedPremium = parseFloat(constants.PRE_DETERMINED_PREMIUM);

				for(var i=0; i < data.length; i++){
					var speedRisk = 0, breakRisk = 0, turnRisk = 0, milesRisk=0, drvRisk = 0;
					
					var avgSpeed = parseFloat(data[i].AVG_SPEED);
					var harshBreaks = parseInt(data[i].HARSH_BREAKS, 10);
					var harshTurns = parseInt(data[i].HARSH_TURNS, 10);
					var dayMiles = parseFloat(data[i].DAY_MILES);
					var nightMiles = parseFloat(data[i].NIGHT_MILES);
					var driverRate = parseFloat(data[i].DRIVER_RATE);
					
					TotalMiles = TotalMiles+ dayMiles + nightMiles;
					
					if (avgSpeed > constants.ALLOWED_SPEED){
						speedRisk = avgSpeed/constants.ALLOWED_SPEED * constants.SPEED_RISK_RATE;
					}
					
					if(harshBreaks > constants.ALLOWED_HARSH_BREAKS){
						breakRisk = harshBreaks/constants.ALLOWED_HARSH_BREAKS * constants.BREAKS_RISK_RATE;
					}
					
					if(harshTurns > constants.ALLOWED_HARSH_TURNS){
						turnRisk = harshTurns/constants.ALLOWED_HARSH_TURNS * constants.TURNS_RISK_RATE;
					}
					
					milesRisk = (dayMiles*constants.DAY_RISK_RATE + nightMiles*constants.NIGHT_RISK_RATE)/(dayMiles+nightMiles);
					
					PolicyRisk = PolicyRisk + (speedRisk+breakRisk+turnRisk+milesRisk)/(constants.SPEED_RISK_RATE + constants.BREAKS_RISK_RATE + constants.TURNS_RISK_RATE + constants.NIGHT_RISK_RATE+ constants.DAY_RISK_RATE);
					
					drvRisk = (dayMiles + nightMiles) * driverRate;
					DriverMiles = DriverMiles + drvRisk;

					console.log('speedRisk: '+speedRisk);
					console.log('breakRisk: '+breakRisk);
					console.log('turnRisk: '+turnRisk);
					console.log('milesRisk: '+milesRisk);
					console.log('PolicyRisk: '+PolicyRisk);
						
				}
				
				console.log('No of drivers: '+parseInt(data.length, 10));
				
				PolicyRisk = PolicyRisk / parseInt(data.length, 10);
				DriverRisk = DriverMiles / TotalMiles;
				
				AccurateRisk = PolicyRisk + DriverRisk;
				ActualPremium = (PreDeterminedPremium/PreDeterminedRisk) * AccurateRisk;
				
				console.log('PolicyRisk: '+PolicyRisk);
				console.log('DriverRisk: '+DriverRisk);
				console.log('AccurateRisk: '+AccurateRisk);
				console.log('ActualPremium: '+ActualPremium);
				/*End of determining risk rate*/
				
				res.render('showPremData',{title:constants.TITLE2,
	    							data: data,
	    							policyNum: policyNum,
	    							startDate:startDate,
	    							stopDate:stopDate,
	    							determinedRisk: PreDeterminedRisk.toFixed(2),
	    							collectedPrem: PreDeterminedPremium.toFixed(2),
	    							revisedRisk: AccurateRisk.toFixed(2),
	    							revisedPrem: ActualPremium.toFixed(2)
									});
			}

		} /*End of successful query*/

	    conn.close(function () {
	      console.log('done - DB Connection closed!');
	    });
	  });
	});
	
	/*ibmdb end of open */
  
});


http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
	console.log('RAD with IoT server listening on port ' + app.get('port'));
	//console.log('Phanindra');
});


