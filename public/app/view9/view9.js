'use strict';

var app = angular.module('myApp.view9', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view9', {
    templateUrl: 'view9/view9.html',
    controller: 'view9Ctrl'
  });
}])

app.controller('view9Ctrl', ['$scope', '$http', '$filter', function($scope, $http, $filter){
  //$scope.openSearch = function(){
  $scope.dialog = $("#dialog-form").dialog()
    $scope.dialog.dialog( "open" )
  //}
  $scope.obj = {}
  $scope.items = [ 'date', 'amount', 'payee', 'account' ]
  $scope.obj.key = $scope.items[0];
  //user clicked on a row in the results table
  $scope.pickRow = function(item){
    $scope.entry = item
    $scope.entry.date = $filter('date')( item.date, 'M/d/yyyy' )
    $scope.disablePayment = true
    $scope.disableDeposit = true
    $scope.entry.deposit == 0 ? $scope.disablePayment = false : $scope.disableDeposit = false
  }
  $scope.clearAmt = function(which){
    which == 'payment' ? $scope.entry.payment = 0 : $scope.entry.deposit = 0
  }
  $scope.filterAmt = function(){
    $scope.obj.val = $filter('number')($scope.obj.val, 2)
  }
}])	//schRegDialog controller
app.directive('wdialog', [ '$http', function($http){
  return {
    link : function(scope,element,attrs, ngModel){

      scope.dialog = $( "#dialog-form" ).dialog({
        autoOpen: false,
        height: 600,
        width: 1040,
        modal: true,
        focus : function(event, ui){
          $( "[id^=sch]").attr( "class", "btn btn-info").attr( "disabled", !scope.user )
        },
        buttons: [  //button label/text : callback
          {
            text : 'Update',
            id : 'schUpdate',
            click : function()
            {
              scope.$apply( function() {
                $http( {
                  url: '/chkUpdate',
                  method: "POST",
                  data : scope.entry } )
                    .then(  function(data){
                      //alert('Document Updated!')
                    })
              })
            }},
          {
            text : 'Reset',
            id : 'schReset',

            click : function()
            { $( '#dialogForm' )[0].reset()
              $( '#resultsForm' )[0].reset()
              $( 'input#dialogAmt' ).maskMoney( 'destroy' )
              $( 'table#resultTable caption' ).html( '' )
              $( 'table#resultTable tbody tr' ).remove()
              scope.obj.key = ""
            }},
          {
            text : 'Find',
            id : 'schFind',
            click: function(){

              scope.$apply( function() {
                $http( {
                  url: '../find',
                  method: "GET",
                  params: scope.obj } )
                    .then(  function(response){
                      scope.results = response.data
                      scope.obj.val = ''
                    })
              })
            }},//find
          {
            text : 'Delete',
            id : 'schDelete',
            click: function(){
              var data = {}
              data._id = scope.entry._id
              scope.$apply( function() {
                $http( {
                  url: '/delete',
                  method: "POST",
                  data : data } )
                    .then(  function(data){
                      element.dialog( "close" );			})
              })
            }},
          {
            text : 'Cancel',
            id : 'schCancel',
            click: function() {
              $( '#dialogForm' )[0].reset()
              $( '#resultsForm' )[0].reset()
              $( 'input#datepicker2' ).maskMoney( 'destroy' )
              $( 'table#resultTable caption' ).html( '' )
              $( 'table#resultTable tbody tr' ).remove()
              $(this).dialog( "close" );
            }}
        ]//buttons
      });//scope.dialog
    }//link
  }//return
}]);//wdialog

