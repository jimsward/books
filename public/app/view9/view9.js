'use strict';

var app = angular.module('myApp.view9', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view9', {
    templateUrl: 'view9/view9.html',
    controller: 'view9Ctrl'
  });
}])

app.controller('view9Ctrl', ['$scope', '$http', '$filter', function($scope, $http, $filter) {
  $scope.found = false
  $scope.obj = {}
  $scope.obj.key = 'date'
  $scope.date = new Date()
  $scope.isDate = true
  $scope.isAmount = false
  $scope.isAccount = false
  $scope.isPayee = false
  $scope.update = function(){
    $http( {
      url: '/chkUpdate',
      method: "POST",
      data : $scope.entry } )
        .then(  function(data){
          //alert('Document Updated!')
        })
  }
  $scope.find = function(){
    switch ($scope.obj.key) {
      case 'date' :
        $scope.obj.val = $scope.date
        break;
      case 'amount' :
        $scope.obj.val = $scope.amount
        break;
      case 'account' :
        $scope.obj.val = $scope.account
        break;
      case 'payee' :
        $scope.obj.val = $scope.payee
        break;
    }
      $http( {
        url: '../find',
        method: "GET",
        params: $scope.obj } )
          .then(  function(response){
            $scope.found = true
            $scope.results = response.data
            console.dir(response.data)
            $scope.obj.val = ''
          })

  }
  $scope.delete = function(){
    var data = {}
    data._id = $scope.entry._id
    $scope.$apply( function() {
      $http( {
        url: '/delete',
        method: "POST",
        data : data } )
          .then(  function(data){
            element.dialog( "close" );			})
    })
  }
  $scope.cancel = function(){
    $( 'table#resultTable tbody tr' ).remove()
    $(this).dialog( "close" );
  }
  $scope.reset = function(){
$scope.obj.val = ""
    $scope.entry = {}
    $scope.results = {}
    $scope.found = false
  }
  $scope.$watch('obj.key', function (newvalue, oldvalue) {
    //console.log(newvalue, oldvalue)
    $scope.obj.key = newvalue
    //$scope.obj.val = $scope.date
    if (newvalue != oldvalue) {
      switch (oldvalue) {
        case 'date' :
          $scope.date = new Date()
          $scope.isDate = false
          break;
        case 'amount' :
          $scope.amount = ''
          $scope.isAmount = false
          break;
        case 'account' :
          $scope.account = ''
          $scope.isAccount = false
          break;
        case 'payee' :
          $scope.payee = ''
          $scope.isPayee = false
          break;
      }
      switch (newvalue) {
        case 'date' :
          $scope.isDate = true
          break;
        case 'amount' :
          $scope.isAmount = true
          break;
        case 'account' :
          $scope.isAccount = true
          break;
        case 'payee' :
          $scope.isPayee = true
          break;
      }
    }
  })
  //user clicked on a row in the results table
  $scope.pickRow = function (item) {
    $scope.entry = item
    console.log('date' + $scope.entry.date)
    $scope.disablePayment = true
    $scope.disableDeposit = true
    $scope.entry.deposit == 0 ? $scope.disablePayment = false : $scope.disableDeposit = false
  }
  $scope.clearAmt = function (which) {
    which == 'payment' ? $scope.entry.payment = 0 : $scope.entry.deposit = 0
  }
  $scope.filterAmt = function () {
    $scope.obj.val = $filter('number')($scope.obj.val, 2)
  }
}])