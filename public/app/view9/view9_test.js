'use strict';

describe('myApp.view9 module', function() {

    beforeEach(module('myApp.view9'));

    describe('view9 controller', function(){

        it('should be defined', inject(function($controller, $rootScope) {
            //spec body
            var scope = $rootScope.$new()
            var view9Ctrl = $controller('view9Ctrl', { $scope: scope });
            expect(view9Ctrl).toBeDefined();
        }));

    });
});