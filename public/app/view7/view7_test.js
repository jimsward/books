

'use strict';

describe('myApp.view7 module', function() {

  beforeEach(module('myApp.view7'));

  describe('view7 controller', function(){

    it('should be defined', inject(function($controller, $rootScope) {
      //spec body
	   var scope = $rootScope.$new()
      var view7Ctrl = $controller('view7Ctrl', { $scope: scope });
      expect(view7Ctrl).toBeDefined();
    }));

  });
});