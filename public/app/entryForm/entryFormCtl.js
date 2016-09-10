var app = angular.module('myApp.entryFormCtl', [])

app.controller('entryFormCtl', ['$scope', '$http', '$filter', '$rootScope', 'addEntry', function($scope, $http, $filter, $rootScope, addEntry){

    if ($rootScope.selected)
    {
        console.log($scope.selected)

    $rootScope.selected.date = new Date($rootScope.selected.date)
    $scope.entry = $rootScope.selected
        $rootScope.newEntry = false
    }
    else {
    $scope.entry = {}
    $rootScope.newEntry = true
        document.getElementById("entrydt").focus()

    $scope.refs = {payment :'Payment', deposit : 'Deposit'}
    $scope.entry.date = new Date()

    $scope.filterDate = function(){
        $scope.date = $filter('date')($scope.dt, 'MM/dd/yyyy')
    }
    $scope.entry.payment = ''
    $scope.entry.deposit = ''
    $scope.disablePayment = true
    $scope.disableDeposit = true
}

    $scope.change = function(){
        //var ref = angular.element( 'select#reference' ).val()
        var ref = $scope.entry.reference
        if ( ref == 'Payment' )
        { $scope.disablePayment = false
            angular.element( '#deposit' ).css('opacity', 0.5)
            angular.element( '#payment' ).css('opacity', 1)
            $scope.disableDeposit = true
        }
        else

        {$scope.disableDeposit = false
            angular.element( '#payment' ).css('opacity', 0.5)
            angular.element( '#deposit' ).css('opacity', 1)
            $scope.disablePayment = true
        }
    }
    $scope.save = function(){
        //validate
        if ( angular.element( '#reference option:selected' ).val() == '' )
        {
            alert('You must choose Deposit or Payment')
            return
        }
        if ( $scope.entry.account == undefined || $scope.entry.account == '' )
        {
            angular.element( '#account' ).text('')
            alert('Please choose an Account')
            return
        }
        if ( ($scope.entry.payment + $scope.entry.deposit) == 0 )
        {
            alert('Please enter an Amount')
            return
        }
        //else

        var dtObj = $scope.entry.date
        console.dir(dtObj)
        var month = (dtObj.getMonth() + 1).toString()
        if (month.length == 1) month = "0" + month
        var day = dtObj.getDate().toString()
        if (day.length == 1) day = "0" + day
        $scope.entry.date =   month + '/' + day + '/' + dtObj.getFullYear()
        console.log('date' + $scope.entry.date)

        var data = $scope.entry
        var promise = addEntry.newEnt(data)
        promise.then( function successCallback(){
                location.reload(true)},
            function errorCallback(response){
                console.log('error' + response.data.error.message)
            }
        )
    }
    $scope.cancel = function(){
        location.reload(false)
    }
    $scope.delete = function(){
        var data = {}
        data._id = $scope.entry._id
        $http( {
            url: '/delete',
            method: "POST",
            data : data } )
            .then(  function(data){
                location.reload(true)})
    }
    $scope.validDate = function(){
        var val = $scope.entry.date
        var val1 = Date.parse(val);
        if (isNaN(val1)==true && val!==''){
            $scope.entry.date = ""
            alert("Please enter a valid date!")
        }
        else{
            console.log(val1);
        }
    }

}])
app.factory('addEntry', ['$http', function($http) {
    return {
        newEnt: function (data) {
            return $http({url: '/newentry', data: data, method: "POST"})
        }
    }
}])
app.directive('entryForm', function(){
    return {
        restrict: 'AE',
templateUrl : 'entryForm/entryForm.html'
        }
    })

