		/*eslint-env browser */
		function validatePolForm() {
			     var policyNum    = document.forms["polForm"]["policyNum"].value;
			
    
			     if (policyNum == null || policyNum == "") {
			        alert("Please enter policy number!");
			        document.forms["polForm"]["policyNum"].focus();
			        return false;
			     }
			     
			}
			
		function validateTermData(tabRow) {
			 
			var Cells = tabRow.getElementsByTagName("td"); 
			document.getElementById("term").value = Cells[0].innerText; 
			document.getElementById("termDataForm").submit();
			 
		}
		