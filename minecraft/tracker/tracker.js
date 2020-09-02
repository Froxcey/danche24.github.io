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
    var tracker = {
        option : {
            user: document.getElementById('trackerInputFormsUser').value,
            uuid: '',
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
        },
        consoleContent: ''
    };
    tracker.docLog('Support <a href="https://www.youtube.com/channel/UC-FLvOdIGGLOIRvKT9_QtOg" target="_blank">Hypersun_pro</a> on Youtube');
    if (document.getElementById('trackerInputFormsInterval') && Number(document.getElementById('trackerInputFormsInterval').value)&& document.getElementById('trackerInputFormsInterval').value != ""){
        if (document.getElementById('trackerInputFormsInterval').value < 5){
            tracker.docLog('Due to network safety, your interval value is too low. Interval value will automatically set to 5');
            tracker.option.interval = 5;
        } else {
            tracker.option.interval = Number(document.getElementById('trackerInputFormsInterval').value);
        }
    }
    if (document.getElementById('trackerInputFormsHypixelKey') && document.getElementById('trackerInputFormsHypixelKey').value != ""){tracker.option.hypixelKey = document.getElementById('trackerInputFormsHypixelKey').value;}
    
    
    if (tracker.option.user.length < 17){
        request.open('get', `https://api.mojang.com/users/profiles/minecraft/${tracker.option.user}`);
        request.onload = function(){
            var respond = JSON.parse(request.response);
            if(respond.id && respond.name){
                tracker.option.uuid = respond.id;
                tracker.option.name = respond.name;
                tracker.docLog(`Success: start tracking player: ${tracker.option.name} (${tracker.option.uuid})`);
            }
        };
        request.send();
    } else {
        tracker.option.user = tracker.option.user.replace("-", "");
        request.open('get', `https://api.mojang.com/user/profiles/${tracker.option.user}/names`);
        request.onload = function(){
            var respond = JSON.parse(request.response);
            if(!respond.error){
                var length = respond.length - 1;
                tracker.option.uuid = tracker.option.user;
                tracker.option.name = respond[length].name;
                tracker.docLog(`Success: start tracking player: ${tracker.option.name} (${tracker.option.uuid})`);
            }
        };
        request.send();
    }
    
    if(!tracker.option.uuid || !tracker.option.name) return tracker.docLog('Error: invalid uuid or name');

    request.open('get', `https://api.hypixel.net/status?key=${tracker.option.hypixelKey}&uuid=${tracker.option.uuid}`);
    request.onloadend = function() {
        var respond = JSON.parse(request.response);
        if (!respond.success){
            tracker.docLog(`Error from Hypixel: ${respond.cause}`);
        } else {
            if (respond.session.online){
                var nowtime = new Date();
                tracker.docLog(`Player now online, game = ${respond.session.game} (${new Date().toLocaleTimeString()})`);
                notify('now online');
                tracker.mem.online = true;
                tracker.mem.game = respond.session.game;
            } else {
                request.open('get', `https://api.hypixel.net/player?key=${tracker.option.hypixelKey}&uuid=${tracker.option.uuid}`);
                request.onloadend = function() {
                    var respond = JSON.parse(request.response);
                    var time = new Date(respond.player.lastLogin);
                    var lastLogin = time.toLocaleDateString() + ' ' + time.toLocaleTimeString();
                    tracker.docLog(`Player offline (Last online: ${lastLogin})`);
                };
                request.send();
            }
        }
    };
    request.send();
    request.timeout = 100000;
    request.ontimeout = function(){
        tracker.docLog('Error: connection timeout(reply from hypixel was too slow)');
    };
    function checkHypixel(){
        request.open('get', `https://api.hypixel.net/status?key=${tracker.option.hypixelKey}&uuid=${tracker.option.uuid}`);
        request.onloadend = function() {
            var respond = JSON.parse(request.response);
            if (!respond.success){
                tracker.docLog(`Error from Hypixel: ${respond.cause}`);
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
                        if (respond.session.game != tracker.mem.game){
                            tracker.mem.game = respond.session.game;
                            tracker.docLog(`Player change game to ${tracker.mem.game} (${new Date().toLocaleTimeString()})`);
                            notify('change game');
                        }
                    }
                } else {
                    if (tracker.mem.online){
                        var nowtime = new Date();
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