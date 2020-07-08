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
          text-align: center;
      }
      .next:hover {
          background-color: #ddd;
          color: black;
      }
  </style>
  <script src="https://www.google.com/recaptcha/api.js"></script>
  </head>
  <body>
    <h1>You're not a bot?</h1> 
    <p>Come on, you know what's reCAPTCHA</p>
    <form action="close.html" name="Redirect"></form>
    <form action="step3.php" method="POST" id="next">
      <BR><BR>
      <div text-align="center" class="g-recaptcha" data-sitekey="6LdMRa0ZAAAAAOAMhalYa9fjix079_nEl0swDKy4"></div>
      <input type="hidden" id="redirected" name="redirected" value="true">
      <input type="submit" value="Next" class="next">
    </form>
  </body>
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
</html>