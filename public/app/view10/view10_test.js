'use strict';

describe('myApp.view10 module', function() {

    beforeEach(module('myApp.view10'));

    describe('view9 controller', function(){

        it('should be defined', inject(function($controller, $rootScope) {
            //spec body
            var scope = $rootScope.$new()
            var view10Ctrl = $controller('view10Ctrl', { $scope: scope });
            expect(view10Ctrl).toBeDefined();
        }));

    });
});
