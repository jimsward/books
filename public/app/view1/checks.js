angular.module('checks', [])
.factory( 'getEntries', [ '$http', function($http) {
	
	this.refresh = function() {
	  $http.get('/')
	 .success(function(data, status, headers, config) {
		return data.items 
		 })
	}
	} ] )