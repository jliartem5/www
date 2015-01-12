//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
var request = require("request");
var socketio = require('socket.io');
var express = require('express');
var async = require("async");
var appConfig = require("./config.js");

//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server, {
    log: false
});


router.use(express.static(path.resolve(__dirname, 'client')));
/**
 * Cache zone
 *
 *
 * */
var Cache = (function () {
    var obj = function (s, user, manager) {
        var _socket = s;
        var _cacheManager = manager;
        var _user = user;
        var last_update_date = null;
        var last_save_date = null;
        var _$this = this;
        /**
         * 
         * {
         Note:{},
         NoteElements:[{},...]
         }
         * 
         * */
        var _cacheData = {};

        _socket.on('disconnect', function () {
            _$this.save(function () {
                _socket.emit('save-resp', "OK");
            }, function () {
                _socket.emit('save-resp', "KO");
            });
            _cacheManager.remove(_$this);
            console.log("Disconnect");
        });

        //update note element
        _socket.on('update', function (data) {
            console.log('Update note data:');
            console.log(data);
            if (data.id === undefined || data.id === null) {
                _socket.emit('update-rest', 'KO')
            }

            _cacheData['NoteElements'][data.id] = data;
            last_update_date = new Date();
            _socket.emit("update-resp", "OK");
        });

        //save all
        _socket.on('save', function (new_note_data) {
            console.log('Save note data:');
            console.log(new_note_data);
            if (_cacheData.length > 0) { //Check if no cache data, for the first time new note for example
                _$this.save(function (data) {
                    last_save_date = new Date();
                    _socket.emit('save-resp', "OK");
                    if (data.sync != undefined) {
                        /**
                         * Synchronise id after save new element/note
                         * Sync structure:
                         *   {
                         *    Note:{from:id, to:id},
                         *    NoteElements:[{from:id, to:id},...] //elements to sync
                         *   }
                         *
                         * */
                        _socket.emit('sync', data.sync);
                        _cacheData['Note'].id = data.sync.Note.to;

                        if (data.sync.NoteElements !== undefined) {
                            for (var i in _cacheData['NoteElements']) {
                                for (var j in data.sync.NoteElements) {
                                    if (data.sync.NoteElements[j].from == _cacheData['NoteElements'].id) {
                                        _cacheData['NoteElements'].id = data.sync.NoteElements[j].to;
                                        break;
                                    }
                                }
                            }
                        }
                    }

                }, function (data) {
                    _socket.emit('save-resp', "KO");
                });
            }
            _cacheData['Note'] = new_note_data;
        });

        _socket.on('clear', function () {
            _$this.clear();
            _socket.emit('clear-resp', 'OK');
        });

        this.getUser = function () {
            return _user;
        };

        this.getSocket = function () {
            return _socket;
        };

        this.setSocket = function (s) {
            _socket = s;
        };

        this.save = function (onSaveSuccess, onSaveFailed) {
            request.post({
                url: appConfig.phpServerURL + "nodes/save",
                form: {
                    data: _cacheData,
                    user: _user
                },
                json: true
            }, function (err, httpResponse, body) {
                var success = false;
                if (!err) {
                    if (body.result == "success") {
                        success = true;
                        _cacheData = {};
                        if (onSaveSuccess !== undefined) {

                            onSaveSuccess(body);
                        }
                    }
                }else{
                    console.log(err);
                }
                if (success === false) {
                    onSaveFailed(body);
                }
            });
        };

        this.clear = function () {
            _cacheData = {};
        };
    };


    return obj;
})();

var CacheManager = (function () {

    var Caches = []; //Variable global pour tous les instances CacheManager

    var obj = function () {
        var _$this = null;
        _$this = this;

        this.add = function (socket, user) {

            var cache = new Cache(socket, user, _$this);
            var index = this.indexOf(cache);
            if (index == -1) {
                Caches.push(cache);
                return true;
            }
            else {
                var address = socket.handshake.address;
                var oldSocket = Caches[index].getSocket();
                oldSocket.emit('disconnect-conflit', {
                    ip: address.address + ":" + address.port,
                    user: user
                });
                socket.emit('connect-conflit', {
                    ip: oldSocket.handshake.address.address + ':' + oldSocket.handshake.address.port,
                    user: Caches[index].getUser()
                });
                oldSocket.disconnect();
                Caches[index] = cache;
            }

        };

        this.remove = function (cacheObj) {
            var index = Caches.indexOf(cacheObj);
            if (index > -1) {
                Caches.splice(index, 1);
            }
            else {

            }
        };

        this.indexOf = function (cacheObj) {
            for (var i = 0; i < Caches.length; ++i) {
                if (Caches[i].getUser().identify = cacheObj.getUser().identify) {
                    return i;
                }
            }
            return -1;
        };
    };
    return obj;
})();

/**
 * Chat zone
 *
 *
 **/
var Roster = (function () {


    return function (socket, user, m) {
        var _socket = socket;
        var _user = user;
        var _manager = m;
        var _connectDateTime = new Date();

        var _$this = this;


        //Triggers object
        var preMessage = null;
        var afterMessage = null;

        _socket.on('disconnect', function () {
            _manager.removeRoster(_$this);
        });

        _socket.on('channelJoin', function (data) {

        });

        _socket.on('channelLeave', function () {

        });
        _socket.on('listChannel', function () {
            var list = _manager.channelList();
            _socket.emit('listChannel-resp', list);
        });
        _socket.on('message', function (data) {
            data.message = preMessage != null ? preMessage(data) : data.message;

            _manager.broadcast(_user, data.message, data.channel, function () {
                _socket.emit('message-resp', {});
            });

            afterMessage != null ? afterMessage(data) : "";

        });

        this.socket = _socket;
        this.user = _user;
    }

})();

var ChatManager = (function () {
    //{
    //  channel: [users]
    //
    //}
    var rosters = {
        global: []
    };

    //{
    //  channel:[{user, message, time}]
    //
    //}
    var messagesCache = {
        global: []
    };
    var messageCacheMaxLength = 150;


    var _$this = null;
    return function () {
        _$this = this;

        this.addRoster = function (socket, user) {
            var r = new Roster(socket, user, this);

            //Save message on get message
            r.afterMessage = function (d) {
                var channel = d.channel;
                if (rosters[channel] == undefined) {
                    return;
                }
                if (messagesCache[channel].length > messageCacheMaxLength) {
                    messagesCache[channel].splice(0, parseInt(messageCacheMaxLength / 2));
                }
                messagesCache[channel].push({
                    user: user,
                    message: d.message,
                    time: new Date()
                });
            };

            rosters.global.push(r);

            _$this.broadcast('', "New connect add:" + user.identify, 'global');
            return true;
        };

        this.removeRoster = function (roster) {
            console.log('try to remove ' + roster.socket.id);
            for (var channel in rosters) {
                for (var r in rosters[channel]) {
                    if (rosters[channel][r].socket.id == roster.socket.id) {
                        console.log('remove ' + rosters[channel][r].socket.id + ' at' + r);
                        if (r > -1) {
                            rosters[channel].splice(r, 1);
                            _$this.broadcast('', "user " + roster.user.identify + " disconnected", 'global');
                            return;
                        }
                    }
                }
            }
        };

        this.joinChannel = function (channel, roster) {
            if (rosters[channel] === undefined) {
                rosters[channel] = [];
            }
            if (messagesCache[channel] === undefined) {
                messagesCache[channel] = [];
            }
            if (rosters[channel].indexOf(roster) == -1) {
                rosters[channel].push(roster);
                for (var i in messagesCache[channel]) {
                    var msg = messagesCache[channel][i];
                    roster._socket.emit('message', {
                        channel: channel,
                        message: msg.message,
                        time: msg.time
                    });
                }

                _$this.broadcast('', "user " + roster.user.identify + " join channel", channel);
            }
        };

        this.leaveChannel = function (channel, roster) {
            if (rosters[channel] === undefined) {
                return;
            }
            var index = rosters[channel].indexOf(roster);
            if (index > -1) {
                rosters[channel].splice(index, 1);
                _$this.broadcast('', "user " + roster.user.identify + " leave channel", channel);
            }
        };

        this.channelList = function () {
            var lst = [];
            for (var channel in rosters) {
                lst.push(channel);
            }
            return lst;
        };

        this.broadcast = function (sender, msg, channel, onFinish) {
            if (rosters[channel] === undefined) {
                return;
            }
            for (var i in rosters[channel]) {
                var item = rosters[channel][i];
                item.socket.emit('message', {
                    'channel': channel,
                    message: msg,
                    time: new Date()
                });
                if (onFinish != undefined) {
                    onFinish();
                }
            }
            console.log('\tsend ' + rosters[channel].length + " entite");
        };

        this.rosterList = function (channel) {
            var r = [];
            if (rosters[channel] == undefined) {
                return r;
            }
            ;

            for (var i in rosters[channel]) {
                var roster = rosters[channel][i];
                r.push(roster.identify);
            }
            ;
            return r;
        };
    }
})();

/**
 *
 *
 *
 */



/**
 *Server wonk
 **/
var cm = new CacheManager();
var rosterManager = new ChatManager();

io.on('connection', function (socket) {
    socket.on('identify', function (data) {
        request.post({
            url: appConfig.phpServerURL + 'users/userBySecurityKey',
            form: {
                security_key: data.security_key
            }
        }, function (err, httpResponse, body) {
            if (err) {
                console.log(err);
                return;
            }
            var userData = JSON.parse(body);
            if (userData.error === undefined) {
                switch (data.type) {
                    case 'cache':
                        if (cm.add(socket, userData)) {
                            socket.emit("identify-resp", "OK");
                        }
                        break;
                    case 'chat':
                        if (rosterManager.addRoster(socket, userData)) {
                            socket.emit("identify-resp", "OK");
                        }
                        break;
                    default:
                        break;
                }
            }
            else {
                console.log('connot find this user by security key');
                socket.disconnect();
            }
        });

    });
});

server.listen(3000, 'localhost' || "0.0.0.0", function () {
    var addr = server.address();
    console.log("Chat server listening at", addr.address + ":" + addr.port);
});
