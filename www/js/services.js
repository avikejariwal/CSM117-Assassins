angular.module('starter.services', [])

.factory('GameInfo', function(){
  var userKey = null;
  var gameKey = null;
  var targetKey = null;

  return {
    setUserInfo: function(username){
      userKey = username;
    },
    setGameInfo: function(gamename, gamekey, gameowner){
      gameKey = gamekey;
      return null
    },
    setTargetInfo: function(targetname) {
      targetKey = targetname;
      return null
    },
    getGameInfo: function(){
      var game = [userKey, gameKey, targetKey];
      return game;
    }
  };
})


