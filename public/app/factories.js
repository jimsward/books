/**
 * Created by Jim on 6/11/2016.
 */
angular.module('myApp')
.factory('getCustomer', ['$http', function($http){
    return {
        cust :
            function(params){
                return $http({url : '/customer', params : params, method : "GET"})
            }}
}])
.factory( 'getEntries', [ '$http', function($http) {
    return $http({url : '/entries', method : 'GET'})
}])
.factory('addEntry', ['$http', function($http) {
    return {
        newEnt :
            function(data){ return $http( {url : '/newentry', data : data, method : "POST"})
            }
    }
}])
.factory( 'getCustomers', [ '$http', function($http) {
    return $http.get('/customers')
}])
.factory( 'customerInit', [ '$http', function($http) {
    var customer = {}
    customer.entries = []
    customer.invoices = []
    customer.name = ''
    customer.company = ''
    customer.address = ''
    customer.phone = ''
    customer.email = ''
    customer.balance = 0
    return customer
}])
.factory( 'addInvoice', [ '$http', function($http) {
    return	{
        saveInv :	function(invoice) {
            return $http({url : '/newInvoice', data : invoice, method : "POST"})
        }
    }
}])
.factory( 'getInvoice', [ '$http', function($http) {
    return {
        getInv : function(number) {
            return	$http({method: 'GET', url: '/invoice', params: number})
        }
    }
}])
.factory( 'getTransactions', [ '$http', function( $http ){
    return {
        get :
            function(params){
                return $http({method : 'GET', url : '/transactions', params : params})
            }
    }
} ] )
.factory('login', [ '$http', function($http){
        return {
            postLogin : function(data){
                return $http({method : "POST", url : '/login', data : data})
            }
        }
    }])
.factory('signUp', ['$http', function($http){
        return {
            signup :
                function(data){
                    return $http({url : '/signup',method : "POST", data : data})
                }
        }
    }])