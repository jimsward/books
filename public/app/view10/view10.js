'use strict';

angular.module('myApp.view10', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view10', {
    templateUrl: 'view10/view10.html',
    controller: 'view10Ctrl'
  });
}])

.controller('view10Ctrl', [ '$routeParams', '$scope', '$http', '$route', '$location', function( $routeParams, $scope, $http, $route, $location ) {
	$scope.contact = {}
	$scope.contactform = function(){
		var text = 'name : ' + $scope.contact.name  + '\n'  + 'email : ' + $scope.contact.email + '\n' + 'message : ' + $scope.contact.message
		var data = { 'text' : text, email : 'jim@jimsward.com' }
		$http.post('/contact', data).then(function(data){//add document to the messages collection
		})
		.then($http.post('/sendemail', data).then( function(){//send email with contact form data
				console.log('sent email message')
				}))
				.then( function(){
					//alert('Form submitted.')
					$location.path('/view1')}) 
		}
}]);