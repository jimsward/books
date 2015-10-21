

'use strict';

describe('myApp.view4 module', function() {

  beforeEach(module('myApp.view4'));

  describe('view4 controller', function(){

    it('should be defined', inject(function($controller, $rootScope) {
      //spec body
	   var scope = $rootScope.$new()
      var view4Ctrl = $controller('View4Ctrl', { $scope: scope });
      expect(view4Ctrl).toBeDefined();
    }));

  });
});