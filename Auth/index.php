<!DOCTYPE html>
<html>
  <head>
    <title>Redirecting...</title>
  </style>
  </head>
  <body>
  	<form action="step1.php" method="POST" name="Redirect">
      <input type="hidden" id="redirected" name="redirected" value="true">
    </form>

  	<script>

		function redirect1(){
			document.forms["Redirect"].submit()
		}
  		if (!navigator.onLine){
  			document.write('Your device isn\'t connected to wifi.')
  		} else {
			document.write('Collecting Discord info...<br>')
			<?php
			    if (isset($_GET["ID"])){
			      $ID = $_GET["ID"];
			    } else {
			      $ID = "false";
			    }
		    ?>
		    document.write('Working with cookie info...<br>');
		    var ID = '<?php echo $ID ?>';
      		if (ID != 'false'){
		        document.cookie = `ID = ${ID}`;
		        document.write("Succesfully write cookie. <BR>");
		        document.write("Redirecting in 2 sec...");
		        setTimeout(redirect1, 2000)
		    } else {
		    	document.cookie = "ID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
		      	document.write("No cookie to write. <BR>");
		      	document.write("Redirecting in 5 sec...");
		      	setTimeout(redirect1, 5000)
		    }
  		}
  	</script>
  </body>
</html>