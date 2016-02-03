'use strict';

angular.module('myApp.view7', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view7', {
    templateUrl: 'view7/view7.html',
    controller: 'view7Ctrl'
  });
}])

.controller('view7Ctrl', [ '$routeParams', '$scope', '$http', '$route', '$location', function( $routeParams, $scope, $http, $route, $location ) {
	$scope.password = ""
	
	$scope.username = ""
	$scope.email = ""
	$scope.submitSignup = function(){			
			var data = { username : $scope.username, email : $scope.email, password : $scope.password }
			$http.post( '/signup', data ).then( function(response){
				console.dir(response)
			//compose email msg
			/*var text = 'The password for ' + response.data.username + ' is ' + response.data.password 
			var data = { 'text' : text, 'email' : $scope.email }
			$http.post('/sendemail', data).then( function(){
				$location.path( '/view1' )
				})
*/			
			},
			function errorCallback(response){
				$scope.username_error = response.data.error
				})
		}
	$scope.redirect = function(){
		$location.path('/view6')
		}
}]);