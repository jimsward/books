

'use strict';

describe('myApp.view6 module', function() {

  beforeEach(module('myApp.view6'));

  describe('view6 controller', function(){

    it('should be defined', inject(function($controller, $rootScope) {
      //spec body
	   var scope = $rootScope.$new()
      var view6Ctrl = $controller('view6Ctrl', { $scope: scope });
      expect(view6Ctrl).toBeDefined();
    }));

  });
});