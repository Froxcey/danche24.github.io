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
firebase.analytics();
var databaseBroadcast = firebase.database().ref().child('broadcast')
databaseBroadcast.on('value', snap => {
    var broadcastSound = new Audio()
    broadcastSound.src = `data:audio/mp3;base64,${snap.val()}`
    broadcastSound.play()
})