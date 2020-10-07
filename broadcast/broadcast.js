var firebaseConfig = {
    apiKey: "AIzaSyAcrcquKzNjKh1PByVK4NglsVlnYXyeDJU",
    authDomain: "application-service-a1b32.firebaseapp.com",
    databaseURL: "https://application-service-a1b32.firebaseio.com",
    projectId: "application-service-a1b32",
    storageBucket: "application-service-a1b32.appspot.com",
    messagingSenderId: "164827554782",
    appId: "1:164827554782:web:b4b1a42c1d8acc753d334f",
    measurementId: "G-80953CEHTZ"
};
firebase.initializeApp(firebaseConfig);
var databaseBroadcast = firebase.database().ref().child('broadcast')
databaseBroadcast.on('value', snap => {
    if (snap.val() == "") return
    var broadcastSound = new Audio()
    broadcastSound.src = `data:audio/mp3;base64,${snap.val()}`
    var initSound = new Audio()
    initSound.src = 'http://danche24.github.io/broadcast/intro.mp3'
    initSound.play()
    setTimeout(function(){
        broadcastSound.play()
    }, 3000)
})