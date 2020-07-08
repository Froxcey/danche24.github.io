<!DOCTYPE html>
<html>
  <head>
    <title>Auth using Google and Discord</title>
    <style>
      h1 {
          text-align: center;
          font-size: 55px;
          font-family:Arial, Helvetica, sans-serif;
      }
      p {
          text-align: center;
          font-size: 30px;
      }
      #next {
          display: flex;
          justify-content: center;
      }
      .next {
          text-decoration: none;
          display: inline-block;
          padding: 8px 16px;
          position: absolute;
          top: 80%;
          background-color: #4CAF50;
          color: white;
          font-size: 25px;
          cursor: pointer;
      }
      .next:hover {
          background-color: #ddd;
          color: black;
      }
  </style>
  </head>
  <body>
    <h1>Authenticate your Discord account</h1> 
    <p>Connect your Discord account to Google account.</p>
    <form action="step2.php" method="POST" id="next">
      <input type="hidden" id="redirected" name="redirected" value="true">
      <input type="submit" value="Next" class="next">
    </form>
    <form action="close.html" name="Redirect"></form>
    <?php
    if (isset($_POST["redirected"])){
      $Redirected = "true";
    } else {
      $Redirected = "false";
    }
  ?>
  <script>
    var redirected = <?php echo $Redirected ?>;
    if (!redirected){
      console.log("redirecting to home since this user haven't gone through the last step")
      document.forms["Redirect"].submit()
    }
  </script>
  </body>
</html>