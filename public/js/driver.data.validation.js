		/*eslint-env browser */
		function validateForm() {
			     var dayMiles    = document.forms["dataForm"]["dayMiles"].value;
			     var nightMiles  = document.forms["dataForm"]["nightMiles"].value;
			     var avgSpeed    = document.forms["dataForm"]["avgSpeed"].value;
			     var harshBreaks = document.forms["dataForm"]["harshBreaks"].value;
			     var harshTurns  = document.forms["dataForm"]["harshTurns"].value;
			    
			     if (isNaN(dayMiles)){
			     	alert("Miles driven in Day must be Numeric");
			     	document.forms["dataForm"]["dayMiles"].focus();
			        return false;
			     }
			     if (isNaN(nightMiles)){
			     	alert("Miles driven in Night must be Numeric");
			     	document.forms["dataForm"]["nightMiles"].focus();
			        return false;
			     }
			     
			     if (dayMiles == null || dayMiles == "") {
			        alert("Miles driven in Day must be filled out");
			        document.forms["dataForm"]["dayMiles"].focus();
			        return false;
			     }
			     if (nightMiles == null || nightMiles == "") {
			        alert("Miles driven in Night must be filled out");
			        document.forms["dataForm"]["nightMiles"].focus();
			        return false;
			     }
			     if (dayMiles == 0 && nightMiles == 0) {
			        alert("Both Miles driven in Day and Night shouldnot be Zero (0)!");
			        document.forms["dataForm"]["dayMiles"].focus();
			        return false;
			     }
			     
			     if (dayMiles < 0) {
			        alert("Miles driven in Day should not be less than zero!");
			        document.forms["dataForm"]["dayMiles"].focus();
			        return false;
			     }
			     
			     if (nightMiles < 0) {
			        alert("Miles driven in Night should not be less than zero!");
			        document.forms["dataForm"]["nightMiles"].focus();
			        return false;
			     }

			     if (isNaN(avgSpeed)){
			     	alert("Average Speed must be Numeric");
			     	document.forms["dataForm"]["avgSpeed"].focus();
			        return false;
			     }
			     
			     if (avgSpeed == null || avgSpeed == "") {
			        alert("Average speed must be filled out");
			        document.forms["dataForm"]["avgSpeed"].focus();
			        return false;
			     }
			     
			     if (avgSpeed == 0) {
			        alert("Average speed should not be Zero (0)!");
			        document.forms["dataForm"]["avgSpeed"].focus();
			        return false;
			     }
			     
			     if (avgSpeed < 0) {
			        alert("Average speed should not be less than Zero (0)!");
			        document.forms["dataForm"]["avgSpeed"].focus();
			        return false;
			     }
			     
			     if (isNaN(harshBreaks)){
			     	alert("Number of harsh breaks must be Numeric");
			     	document.forms["dataForm"]["harshBreaks"].focus();
			        return false;
			     }
			     
			     if (harshBreaks == null || harshBreaks == "") {
			        alert("Number of harsh breaks must be filled out");
			        document.forms["dataForm"]["harshBreaks"].focus();
			        return false;
			     }
			     
			     if (harshBreaks < 0) {
			        alert("Number of harsh breaks should not be less than Zero (0)!");
			        document.forms["dataForm"]["harshBreaks"].focus();
			        return false;
			     }
			     
			     if (isNaN(harshTurns)){
			     	alert("Number of harsh turns must be Numeric");
			     	document.forms["dataForm"]["harshTurns"].focus();
			        return false;
			     }
			     
			     if (harshTurns == null || harshTurns == "") {
			        alert("Number of harsh turns must be filled out");
			        document.forms["dataForm"]["harshTurns"].focus();
			        return false;
			     }
			     
			      if (harshTurns < 0) {
			        alert("Number of harsh turns should not be less than Zero (0)!");
			        document.forms["dataForm"]["harshTurns"].focus();
			        return false;
			     }
			     
			}