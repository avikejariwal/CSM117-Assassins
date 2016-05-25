angular.module('starter.controllers', [])

.controller('startPageCtrl', function($state,$scope){
         $scope.newGame = function(){
          console.log("newGame called");
            $state.go('newGame');
         };
         $scope.joinGame = function(){
            console.log("joinGame called");
            $state.go('joinGame');
         };
})

.controller('newGameCtrl', function($state, $scope, GameInfo){
  $scope.createGame = function(username, gameName){
    console.log("create game called");
    var games  = firebase.database().ref().child('games');
    var user = {
      username : username,
      alive: true,
      target: null
    };
    var game = {
      game_Name: gameName,
      game_Owner: username,
      num_Users: 1,
    };
    var usrName = username
    var game_key = games.push(game).key;

    //console.log(game_key);
    var user_key = games.child(game_key.toString()).child('users').push(user); 
    games.child(game_key).child('num_Users').set(1);
    games.child(game_key).child('game_Started').set(false);
    GameInfo.setUserInfo(username);
    GameInfo.setGameInfo(gameName, game_key, username);
    $state.go('lobby');
  };
})

.controller('joinGameCtrl', function($state, $scope, GameInfo) {
  var fb_games = firebase.database().ref().child('games'); 

  fb_games.on('value', function(snapshot){
    $scope.games = snapshot.val();
    console.log($scope.games);
  });

  if ($scope.games == null) {
    console.log("no games available");
  }

  $scope.joinGame = function(username, gamename){
    var key = null;
    var user = {
      username : username,
      alive: true,
      target: null
    };

    var keys = Object.keys($scope.games);
    console.log(keys);

    for (var i = 0; i< keys.length; i++){
      key = keys[i];
      if ($scope.games[key].game_Name == gamename){
          fb_games.child(key.toString()).child('users').push(user);
          var temp = $scope.games[key].num_Users;
          console.log(temp);
          fb_games.child(key).child('num_Users').set(temp+1);
          console.log(true);
      }
    }
    GameInfo.setUserInfo(username);
    GameInfo.setGameInfo(gamename, key);
    $state.go('lobby');
  };
})

.controller('lobbyCtrl', function($state, $scope, GameInfo) {
  var info = GameInfo.getGameInfo();
  var username = info[0];
  var gamename = info[1];
  var gamekey = info[2];
  var targetname = info[3];
  var gameowner = info[4];
  $scope.canStart = false;
  var isOwner = false;
  if (username == gameowner)
    isOwner = true;

  var fb_game = firebase.database().ref().child('games').child(gamekey);
  fb_game.on('value', function(snapshot){
    $scope.game = snapshot.val();
    console.log($scope.game);
    $scope.users = $scope.game['users'];
    if ($scope.game.num_Users >= 2 ){//&& isOwner) {
      $scope.canStart = true;
    }
  });

  $scope.leaveGame = function() {
    $state.go('startPage');

  }

  $scope.startGame = function() {
      fb_game.child('game_Started').set(true);
      var keysList = Object.keys($scope.users);
      var num_users = $scope.game.num_Users

      for (var i = 0 ; i < num_users ; i++)
      {
          var temp = Math.floor((Math.random() * (num_users-1)) + 0);
          while (temp==i)
              temp = Math.floor((Math.random() * (num_users-1)) + 0);
          console.log(keysList[temp]);
      }
      console.log("game started");
     // $state.go('gamePage');
  }
})


.controller('mapViewCtrl', function($state, $scope, GameInfo) {

})


