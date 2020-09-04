function trackerStart(){
    if (!document.getElementById('trackerInputFormsUser')) return console.error('the id \"trackerInputFormUser\" is required');
    if (!document.getElementById('trackerConsole')) return console.error('the id \"trackerConsole\" is required');
    function notify(message){
        if (!("Notification" in window)) {
            alert("This browser does not support desktop notification");
        }
        if (Notification.permission == "granted"){
            var info = new Notification(`Tracking player ${message}`);
        } else {
            Notification.requestPermission();
        }
    }
    var request = new XMLHttpRequest();
    var firstRequest = new XMLHttpRequest();
    var tracker = {
        option : {
            user: document.getElementById('trackerInputFormsUser').value,
            uuid: document.getElementById('trackerInputFormsUser').value,
            name: '',
            interval: 10,
            hypixelKey: 'eb954b0a-acc4-4d97-983e-4758f3eaa410',
        },
        calculation : {
            second: 0,
            minute: 0,
            hour: 0,
            getTime(){
                var s = tracker.calculation.second;
                var m = tracker.calculation.minute;
                var h = tracker.calculation.hour;
                if (tracker.calculation.second.toString().length == 1){
                    s = '0' + tracker.calculation.second;
                }
                if (tracker.calculation.minute.toString().length == 1){
                    m = '0' + tracker.calculation.minute;
                }
                return('Total time played: ' + h + ':' + m + ':' + s);
            },
            addtime(){
                tracker.calculation.second += tracker.option.interval;
                if (tracker.calculation.second >= 60){
                    tracker.calculation.second -= 60;
                    tracker.calculation.minute += 1;
                }
                if (tracker.calculation.minute >= 60){
                    tracker.calculation.minute -= 60;
                    tracker.calculation.hour += 1;
                }
            }
        },
        docLog(data){
            tracker.consoleContent = `${tracker.consoleContent}${data} <BR>`;
            document.getElementById('trackerConsole').innerHTML = tracker.consoleContent;
        },
        mem: {
            online: false,
            game: '',
            lastLogout: new Date(),
        },
        consoleContent: ''
    };
    tracker.docLog('Support <a href="https://www.youtube.com/channel/UC-FLvOdIGGLOIRvKT9_QtOg" target="_blank">Hypersun_pro</a> on Youtube');
    tracker.docLog('Leave this page AFK, and I will report to you when someone go online');
    if (document.getElementById('trackerInputFormsInterval') && Number(document.getElementById('trackerInputFormsInterval').value)&& document.getElementById('trackerInputFormsInterval').value != ""){
        if (document.getElementById('trackerInputFormsInterval').value < 5){
            tracker.docLog('Due to network safety, your interval value is too low. Interval value will automatically set to 5');
            tracker.option.interval = 5;
        } else {
            tracker.option.interval = Number(document.getElementById('trackerInputFormsInterval').value);
        }
    }
    if (document.getElementById('trackerInputFormsHypixelKey') && document.getElementById('trackerInputFormsHypixelKey').value != ""){tracker.option.hypixelKey = document.getElementById('trackerInputFormsHypixelKey').value;}
    
    //check uuid and name on hypixel
    firstRequest.open('get', `https://api.hypixel.net/player?key=${tracker.option.hypixelKey}&uuid=${tracker.option.uuid}`);
    firstRequest.onloadend = function(){
        var respond = JSON.parse(firstRequest.response);
        if (!respond.success) {
            tracker.docLog(`Error from Hypixel: ${respond.reason}`);
            return;
        } else {
            tracker.option.name = respond.player.playername;
            tracker.mem.lastLogout = new Date(respond.player.lastLogout);
            tracker.docLog(`Successfully connect to Hypixel`);
            tracker.docLog(`Start tracking ${tracker.option.name}`);
            firstCheck();
        }
    };
    firstRequest.send();
    firstRequest.timeout = 10000;

    //get first session check
    function firstCheck(){
        request.open('get', `https://api.hypixel.net/status?key=${tracker.option.hypixelKey}&uuid=${tracker.option.uuid}`);
        request.onloadend = function() {
            var respond = JSON.parse(request.response);
            if (!respond.success){
                tracker.docLog(`Error from Hypixel: ${respond.cause}`);
                return;
            } else {
                if (respond.session.online){
                    var nowtime = new Date();
                    tracker.docLog(`Player now online, game: ${respond.session.gameType} (${new Date().toLocaleTimeString()})`);
                    notify('now online');
                    tracker.mem.online = true;
                    tracker.mem.game = respond.session.gameType;
                } else {
                    tracker.docLog(`Player offline (Last online: ${tracker.mem.lastLogout.toLocaleDateString()} ${tracker.mem.lastLogout.toLocaleTimeString()})`);
                }
            }
        };
        request.send();
        request.timeout = 100000;
        request.ontimeout = function(){
            tracker.docLog('Error: connection timeout(internet too slow)');
        };
    }
    //real check
    function checkHypixel(){
        request.open('get', `https://api.hypixel.net/status?key=${tracker.option.hypixelKey}&uuid=${tracker.option.uuid}`);
        request.onloadend = function() {
            var respond = JSON.parse(request.response);
            if (!respond.success){
                tracker.docLog(`Error from Hypixel: ${respond.cause}`);
                return;
            } else {
                if (respond.session.online){
                    if (!tracker.mem.online){
                        var nowtime = new Date();
                        tracker.docLog(`Player now online, game = ${respond.session.game} (${new Date().toLocaleTimeString()})`);
                        notify('now online');
                        tracker.mem.online = true;
                        tracker.calculation.addtime();
                        tracker.mem.game = respond.session.game;
                    } else {
                        tracker.calculation.addtime();
                        if (respond.session.gameType != tracker.mem.game){
                            tracker.mem.game = respond.session.gameType;
                            tracker.docLog(`Player change game to ${tracker.mem.gameType} (${new Date().toLocaleTimeString()})`);
                            notify('change game');
                        }
                    }
                } else {
                    if (tracker.mem.online){
                        tracker.docLog(`Player now offline (${new Date().toLocaleTimeString()})`);
                        notify('now online');
                        tracker.mem.online = false;
                    }
                }
            }
        };
        request.send();
    }
    setInterval(checkHypixel, tracker.option.interval * 1000);
    if (document.getElementById('trackerCalculate')){
        document.getElementById('trackerCalculate').onclick = function() {
            tracker.docLog(tracker.calculation.getTime());
        };
    }
}