
angular.module('starter.controllers',[])

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
    GameInfo.setUserInfo(user_key);
    GameInfo.setGameInfo(game_key);
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
          var user_key =  fb_games.child(key.toString()).child('users').push().key;
          fb_games.child(key.toString()).child('users/'+user_key).set(user);
          var temp = $scope.games[key].num_Users;
          console.log(temp);
          fb_games.child(key).child('num_Users').set(temp+1);
          console.log(true);
      }
    }
    GameInfo.setUserInfo(user_key);
    GameInfo.setGameInfo(game_key);
    $state.go('lobby');
  };
})

.controller('lobbyCtrl', function($state, $scope, GameInfo) {
  var info = GameInfo.getGameInfo();
  var userkey = info[0];
  var gamekey = info[1];
  $scope.canStart = false;
  var isOwner = false;

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
        fb_game.on('value', function(snapshot){
    $scope.game = snapshot.val();
    $scope.users = $scope.game['users'];
    });
      var userKeysList = Object.keys($scope.users);
      var num_users = $scope.game.num_Users;
      var assasinsKeysList = userKeysList;
      var isSame = true;
      var targetList = [];

      var shuffle = function(a) {
        console.log("shuffle called");
        var j, x, i;
        for (i = a.length; i; i -= 1) {
          j = Math.floor(Math.random() * i);
          x = a[i - 1];
          a[i - 1] = a[j];
          a[j] = x;
          }
      }
      var usrTargetSet = false;
      //shuffle(assasinsKeysList);
      console.log(assasinsKeysList);
      console.log(userKeysList)
      var i = 0;
      for ( ; i < assasinsKeysList.length-1; i++) {
          fb_game.child('users/' + userKeysList[i]).child('target').set(assasinsKeysList[i+1]);
          targetList.push(assasinsKeysList[i+1]);
          if (userkey == userKeysList[i]){
            usrTargetSet = true;
            GameInfo.setTargetInfo(assasinsKeysList[i+1]);
          }
        }
       fb_game.child('users/' + userKeysList[i]).child('target').set(assasinsKeysList[0]);
       if (!usrTargetSet){
        GameInfo.setTargetInfo(assasinsKeysList[0]);
       }

      $state.go('gamePage');
  }
})


.controller('gamePageCtrl', function($cordovaGeolocation, $state, $scope, GameInfo) {
      $scope.googleMapsUrl="https://maps.googleapis.com/maps/api/js?key=AIzaSyCh5Yp1llOnhkQvSZs6wIE9lRU8IL_Gb3Y";
      var gameInfo = GameInfo.getGameInfo();
      var userKey, gameKey, targetKey;

      if (gameInfo.length == 0) {
          userKey = '-KIeRBzWhdl336BsEXp3';
          gameKey = '-KIeRBzQL9ZEFlNfVmsK';
          targetKey = '-KIeREqwpeOVmIWHdjJo';
      }
      else {
        userKey = gameInfo[0];
        gameKey = gameInfo[1];
        targetKey = gameInfo[2];
      }
       var user_lat, user_long, map;

      $cordovaGeolocation.getCurrentPosition().then(function(position){
        var user_lat = position.coords.latitude;
        var user_long = position.coords.longitude;
        console.log(user_lat + ' ' + user_long);
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat:user_lat, lng: user_long},
          zoom: 15
        });
      });

      
})


