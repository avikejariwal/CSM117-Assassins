angular.module('starter.services', [])

.factory('GameInfo', function(){
  var userName = null;
  var gameName = null;
  var targetName = null;
  var gameKey = null;

  return {
    setUserInfo: function(username){
      userName = username;
      return null
    },
    setGameInfo: function(gamename, gamekey){
      gameName = gamename;
      gameKey = gamekey;
      return null
    },
    setTargetInfo: function(targetname) {
      targetName = targetname;
      return null
    },
    getGameInfo: function(){
      var game = [userName, gameName, gameKey, targetName];
      return game;
    }
  };
})


