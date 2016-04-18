'use strict';

describe('myApp.view1 module', function() {

  beforeEach(module('myApp.view1'));

  describe('view1 controller', function(){
	var $httpBackend, $rootScope, createController, authRequestHandler;
    it('should be defined', inject(function($controller, $rootScope) {
      //spec body
	  var scope = $rootScope.$new()
      var view1Ctrl = $controller('view1Ctrl', { $scope: scope });
      expect(view1Ctrl).toBeDefined();
    }));
	
	
  });
});