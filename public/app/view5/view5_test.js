

'use strict';

describe('myApp.view5 module', function() {

  beforeEach(module('myApp.view5'));

  describe('view5 controller', function(){

    it('should be defined', inject(function($controller, $rootScope) {
      //spec body
	   var scope = $rootScope.$new()
      var view5Ctrl = $controller('view5Ctrl', { $scope: scope });
      expect(view5Ctrl).toBeDefined();
    }));

  });
});