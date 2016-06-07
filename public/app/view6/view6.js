'use strict';

angular.module('myApp.view6', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view6', {
    templateUrl: 'view6/view6.html',
    controller: 'view6Ctrl'
  });
}])

.controller('view6Ctrl', [ '$routeParams', '$scope', '$http', '$route', '$location', 'login', '$rootScope', function( $routeParams, $scope, $http, $route, $location, login, $rootScope ) {
	$scope.username = ""
	$scope.password = ""
	$scope.submitLogin = function(){
		var data = { username : $scope.username, password : $scope.password }
		var promise = login.postLogin(data)
		promise.then( function( response ){
			$location.path('/view1')},

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