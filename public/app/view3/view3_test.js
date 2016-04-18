

'use strict';

describe('myApp.view3 module', function() {

  beforeEach(module('myApp.view3'));

  describe('view3 controller', function(){

    it('should ....', inject(function($controller, $rootScope) {
      //spec body
	   var scope = $rootScope.$new()
      var view3Ctrl = $controller('view3Ctrl', { $scope: scope });
      expect(view3Ctrl).toBeDefined();
    }));

  });
});