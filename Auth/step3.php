<?php
// Checks if form has been submitted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    function post_captcha($user_response) {
        $fields_string = '';
        $fields = array(
            'secret' => '6LdMRa0ZAAAAAHFT7TLI2fJck7xGNxQwHcigMhEd',
            'response' => $user_response
        );
        foreach($fields as $key=>$value)
        $fields_string .= $key . '=' . $value . '&';
        $fields_string = rtrim($fields_string, '&');

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, 'https://www.google.com/recaptcha/api/siteverify');
        curl_setopt($ch, CURLOPT_POST, count($fields));
        curl_setopt($ch, CURLOPT_POSTFIELDS, $fields_string);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, True);

        $result = curl_exec($ch);
        curl_close($ch);

        return json_decode($result, true);
    }

    // Call the function post_captcha
    $res = post_captcha($_POST['g-recaptcha-response']);

    if (!$res['success']) {
        // What happens when the CAPTCHA wasn't checked
        $success = "false";
    } else {
        // If CAPTCHA is successfully completed...
        $success = "true";
        // Paste mail function or whatever else you want to happen here!
    }
} else { ?>
    
<!-- FORM GOES HERE -->

<?php } ?>

<!--actual site-->
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
    </style>
    <meta name="google-signin-client_id" content="25686087317-2radgq4h5mninf21ec8cdro3fe8c8rg9.apps.googleusercontent.com">
  </head>
  <body>





    <h1>Google Login (Use school account)</h1> 
    <p>EZ and Simple</p>

    <div id="my-signin2"></div>
  <script>
    function onSuccess(googleUser) {
      console.log('Logged in as: ' + googleUser.getBasicProfile().getName());
      console.log('Logged in as: ' + googleUser.getBasicProfile().getEmail());
      console.log('Logged in as: ' + googleUser.getBasicProfile().getEmail().replace("@kas.tw", ""));
      document.write('Logged in as: ' + googleUser.getBasicProfile().getName());
    }
    function onFailure(error) {
      console.log(error);
    }
    function renderButton() {
      gapi.signin2.render('my-signin2', {
        'scope': 'profile email',
        'width': 240,
        'height': 50,
        'longtitle': true,
        'theme': 'dark',
        'onsuccess': onSuccess,
        'onfailure': onFailure
      });
    }
  </script>

  <script src="https://apis.google.com/js/platform.js?onload=renderButton" async defer></script>
  
  <a href="#" onclick="signOut();">Sign out</a>
<script>
  function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
</script>






    <form action="close.html" name="Redirect"></form>
    <form action="step2.php" method="POST" name="Redirect_2"><input type="hidden" id="redirected" name="redirected" value="true"></form>
  </body>
  <?php
    if (isset($_POST["redirected"])){
      $Redirected = "true";
    } else {
      $Redirected = "false";
    }
  ?>
  <script>
    document.onload(signOut())
    var redirected = <?php echo $Redirected ?>;
    var success = <?php echo $success ?>;
    if (!redirected){
      console.log("redirecting to home since this user haven't gone through the last step")
      document.forms["Redirect"].submit()
    }
    if (!success){
      document.forms["Redirect_2"].submit()
    }
  </script>
</html>