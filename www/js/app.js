// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider 

    .state('startPage', {
      url:'/startPage',
      templateUrl: 'templates/startpage.html',
      controller:'startPageCtrl'
      
    })

    .state('newGame',{
      url:'/newGame',
      templateUrl:'templates/newGame.html',
      controller:'newGameCtrl'
    })

    .state('joinGame', {
      url:'/joinGame',
      templateUrl: 'templates/joinGame.html',
      controller:'joinGameCtrl'
    })

    .state('lobby', {
      url:'/lobby', 
      templateUrl: 'templates/lobby.html',
      controller: 'lobbyCtrl'
    })

    .state('gamePage', {
      url:'/gamePage',
      templateUrl: 'templates/gamePage.html',
      controller: 'gamePageCtrl'
    }) 


  // Each tab has its own nav history stack:


  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/startPage');

});
