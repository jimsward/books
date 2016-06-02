'use strict';

angular.module('myApp.view6', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view6', {
    templateUrl: 'view6/view6.html',
    controller: 'view6Ctrl'
  });
}])

.controller('view6Ctrl', [ '$routeParams', '$scope', '$http', '$route', '$location', 'login', function( $routeParams, $scope, $http, $route, $location, login ) {
	$scope.username = ""
	$scope.password = ""
	$scope.submitLogin = function(){
		var data = { username : $scope.username, password : $scope.password }
		var promise = login.postLogin(data)
		promise.then( function( response ){
			console.log(response.config.data.username)
			$location.path('/view1').search({'username' : response.config.data.username})},
			function errorCallback(response){
				$scope.login_error = response.data.error			
					})//then		
		}//submitLogin
}])
.factory('login', [ '$http', function($http){
	return {
		postLogin : function(data){
			return $http({method : "POST", url : '/login', data : data})
		}
	}
}])