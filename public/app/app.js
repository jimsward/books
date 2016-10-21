'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.view3',
  'myApp.view4',
  'myApp.view5',
  'myApp.view6',
  'myApp.view7',
  'myApp.view8',
  'myApp.view9',
   'myApp.view10',
   'myApp.entryFormCtl',
    'myApp.home',
   'myApp.version',
  'ngMessages',
  'angular-loading-bar',
  'ngResource',
  'ngMaterial',
  'material.svgAssetsCache',
   'md.data.table',
    'auth0',
    'angular-storage',
    'angular-jwt'

]).
config(['$routeProvider', function($routeProvider) {

	$routeProvider.when('/customer', {
        templateUrl: 'view3/view3.html',
        controller: 'view3Ctrl'
      })
       .when('/view1', {
         templateUrl: 'view1/view1.html',
         controller: 'view1Ctrl'
        })
	  .when('/invoice', {
        templateUrl: 'view4/view4.html',
        controller: 'view4Ctrl'
      })
	  .when('/transactions', {
        templateUrl: 'view5/view5.html',
        controller: 'view5Ctrl'
      })
	  .when('/view6', {
        templateUrl: 'view6/view6.html',
        controller: 'view6Ctrl'
      })
	  .when('/view7', {
        templateUrl: 'view7/view7.html',
        controller: 'view7Ctrl'
      })
      .when('/view8', {
        templateUrl: 'view8/view8.html',
        controller: 'view8Ctrl'
        })
      .when('/view9', {
        templateUrl: 'view9/view9.html',
        controller: 'view9Ctrl'
        })
        .when('/view10', {
            templateUrl: 'view10/view10.html',
            controller: 'view10Ctrl'
        })
        .when('/home', {
            templateUrl: 'home/home.html',
            controller: 'homeCtrl'
        })
  .otherwise({redirectTo: '/view1'});
}])
    .config(function($mdThemingProvider, $mdIconProvider){

       /* $mdIconProvider
            .defaultIconSet("./assets/svg/avatars.svg", 128)
            .icon("menu"       , "./assets/svg/menu.svg"        , 24)
            .icon("share"      , "./assets/svg/share.svg"       , 24)
            .icon("google_plus", "./assets/svg/google_plus.svg" , 512)
            .icon("hangouts"   , "./assets/svg/hangouts.svg"    , 512)
            .icon("twitter"    , "./assets/svg/twitter.svg"     , 512)
            .icon("phone"      , "./assets/svg/phone.svg"       , 512);*/

        $mdThemingProvider.theme('default')
            .primaryPalette('indigo')
            .accentPalette('pink')
            .warnPalette('deep-orange')
            .backgroundPalette('grey');

    })
    .config(['cfpLoadingBarProvider', function(cfpLoadingBarProvider) {
        cfpLoadingBarProvider.includeSpinner = false;
    }])
    .config(function($mdAriaProvider) {
        // Globally disables all ARIA warnings.
        $mdAriaProvider.disableWarnings();
    })
    .config(function($provide, authProvider, $httpProvider, jwtInterceptorProvider) {

        authProvider.init({
            domain: 'jimbob1953.auth0.com',
            clientID: 'ogYuz2sCD57CfasGQ3Ln5KOGNzkBFDBG'
        });

        /* $urlRouterProvider.otherwise("/home");

         $stateProvider
         .state('home', {
         url: '/home',
         templateUrl: 'components/home/home.tpl.html'
         })
         .state('profile', {
         url: '/profile',
         templateUrl: 'components/profile/profile.tpl.html',
         controller: 'profileController as user'
         });*/

        jwtInterceptorProvider.tokenGetter = function(store) {
            return store.get('token');
        }

        //function redirect($q, $injector, auth, store, $location) {


        function redirect($q, $injector, $timeout, store, $location) {
            var auth;
            $timeout(function() {
                auth = $injector.get('auth');
            });



            return {
                responseError: function(rejection) {

                    if (rejection.status === 401) {
                        auth.signout();
                        store.remove('profile');
                        store.remove('token');
                        $location.path('/home')
                    }
                    return $q.reject(rejection);
                }
            }
        }
        $provide.factory('redirect', redirect);

        $httpProvider.interceptors.push('jwtInterceptor');
        $httpProvider.interceptors.push('redirect');
    })
    .run(function($rootScope, auth, store, jwtHelper, $location) {

        $rootScope.$on('$locationChangeStart', function() {
            // Get the JWT that is saved in local storage
            // and if it is there, check whether it is expired.
            // If it isn't, set the user's auth state
            var token = store.get('token');
            if (token) {
                if (!jwtHelper.isTokenExpired(token)) {
                    if (!auth.isAuthenticated) {
                        auth.authenticate(store.get('profile'), token);
                    }
                }
            }
            else {
                // Otherwise, redirect to the home route
                $location.path('/home');
            }
        });

    })

