

'use strict';

describe('myApp.view8 module', function() {

  beforeEach(module('myApp.view8'));

  describe('view8 controller', function(){

    it('should be defined', inject(function($controller, $rootScope) {
      //spec body
	   var scope = $rootScope.$new()
      var view8Ctrl = $controller('view8Ctrl', { $scope: scope });
      expect(view8Ctrl).toBeDefined();
    }));

  });
});