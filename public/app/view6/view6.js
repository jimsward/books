'use strict';

angular.module('myApp.view6', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view6', {
    templateUrl: 'view6/view6.html',
    controller: 'view6Ctrl'
  });
}])

.controller('View6Ctrl', [ '$routeParams', '$scope', '$http', '$route', '$location', function( $routeParams, $scope, $http, $route, $location ) {	
	$scope.username = ""
	$scope.password = ""
	$scope.submitLogin = function(){
		var data = { username : $scope.username, password : $scope.password }
		$http.post( '/login', data ).then( function( response ){
			console.log(response.config.data.username)
			$location.path('/view1').search({'username' : response.config.data.username})},
			function errorCallback(response){
				$scope.login_error = response.data.error			
					})//then		
		}//submitLogin
}]);