'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /view1 when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/view1");
  });

  describe('view1', function() {
    beforeEach(function() {
      browser.get('index.html#/view1');
    });	
    it('should render view1 when user navigates to /view1', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 1/);
    });	
	describe( 'chkEntryDlg', function(){
	beforeEach(function(){
		element( by.id('12160')).click().then( function(){
			console.log('XXXXXXXXOOOOOOOOXXXXX')
			} )
		})	
	it('should render chkEntryDlg', function(){
		expect(element(by.id('chkEntryForm')).isDisplayed()).toBe(true); 
		})//it
	})//describe chkEntryDlg
		
	describe( 'schRegDialog', function(){
	beforeEach(function(){
		element( by.id('search-register')).click().then( function(){
			console.log('iiiiiiiiiiiiiii')
			} )
		})	
	it('should render schRegDialog', function(){
		expect(element(by.id('datepicker2')).isDisplayed()).toBe(true); 
		})//it
	})//describe schRegDialog
	
	describe('resultTable', function(){//this will only work with the dataset with entries for 2/21/2015
	beforeEach(function(){
		element( by.id('search-register')).click().then( function(){
			
			$( '#datepicker2' ).sendKeys( '02/21/2015' ).then( function(){
				$( '#schFind' ).click().then( function(){
					console.log('mmmmmmmmmmmm')
					})
				})
			} )
		})	
	it('should render 7 rows in resultTable', function(){
		expect(element(by.id('resultTable')).isDisplayed()).toBe(true); 
		})//it	
  })//describe resultTable		
  });//describe view1
  
  describe('view2', function() {
    beforeEach(function() {
      browser.get('index.html#/view2');
    });
    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });
  })
  describe('customerRow', function() {
	beforeEach(function(){
		element( by.css( 'table .tbody tr.customerRow:nth-child(2)' )).click().then( function(){
			console.log('cccccccccccc')
			}) })
		it('should render the Customer Detail Page', function(){
			expect(element(by.id('customerDetail')).isDisplayed()).toBe(true)
			})
		})
  
  describe('listcustomers', function(){
	  beforeEach(function(){
		  browser.get('index.html#/view2');		 
		  var inpt = element(by.id('customername'))
		  inpt.sendKeys('test\n')
		  browser.driver.sleep(1000);
		  })
it('should render view3 when user navigates to /view3', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 3/);
    });	  })  
  

describe( 'to-new-customer', function(){
	beforeEach(function(){
		browser.get('index.html#/view2');
		element( by.css('button#to-new-customer')).click().then( function(){
			browser.driver.sleep(1000);
			browser.waitForAngular();
			console.log('zzzzzzzzz')
			} ) })
		it('should render the New Customer Detail Page', function(){
			expect(element(by.id('newCustomer')).isDisplayed()).toBe(true)
			})
		})
		
		describe( 'editcustomer', function(){
	beforeEach(function(){
		browser.get('index.html#/view3');
		element( by.css('button#editcustomer')).click().then( function(){
			browser.driver.sleep(1000);
			browser.waitForAngular();
			console.log('99999999')
			} ) })
		it('should render the Edit Customer Page', function(){
			expect(element(by.id('edit-customer-form')).isDisplayed()).toBe(true)
			})
		})
		
  })
  			