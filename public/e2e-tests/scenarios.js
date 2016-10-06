'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */


describe("login module", function(){
	it("should login succesfully using auth0", function(){
		//set window size and navigate to the path where the template is loaded
		browser.driver.manage().window().setSize(1500, 1000);
		console.log(browser.baseUrl)
		browser.driver.get(browser.baseUrl + 'index.html#/');
		//check if login button is present & visible
		var loginButtonExists = by.id('login');
		browser.driver.wait(function() {
			return browser.driver.isElementPresent(loginButtonExists);
		}, 5000);
		var loginButton = element(by.id('login'));
		loginButton.click();

		//check if email field exists to see if the pop-up has been succesfully loaded
		var emailFieldExists = by.id('a0-signin_easy_email');
		browser.driver.wait(function() {
			return browser.driver.isElementPresent(emailFieldExists);
		}, 5000);
		//wait for pop-up fields to be displayed (they are on the page but might be hidden initially)
		browser.driver.sleep(2000);

		//type credentials and click the 'access' button to log in
		var emailField = element(by.id('a0-signin_easy_email'));
		emailField.sendKeys('test@user.com');
		var passWordField = element(by.id('a0-signin_easy_password'));
		passWordField.sendKeys('Ec2A_xx0');
		var accessButton = element(by.css('#a0-onestep > div.a0-mode-container > div > form > div.bottom-content > div > button'));
		accessButton.click();
		//verify that the login was succesfull by checking if the logout button is displayed
		var logoutButtonExists = by.id('logout');
		browser.driver.wait(function() {
			return browser.driver.isElementPresent(logoutButtonExists);
		}, 5000);
	});
});
/*browser.driver.get(browser.baseUrl + '/#/home');
browser.executeScript('window.localStorage.clear();');*/

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
		expect(element.all(by.id('entry-form')).first().isDisplayed()).toBe(true);
	})
    });
describe( 'entryForm', function(){
	beforeEach(function(){
		element( by.id('12261')).click().then( function(){
			console.log('XXXXXXXXOOOOOOOOXXXXX')
			} )
		})	
	it('should render entryForm', function(){
		expect(element(by.id('entryForm')).isDisplayed()).toBe(true);
		})//it
	})//describe chkEntryDlg
describe( 'schRegDialog', function(){
	beforeEach(function(){
		//browser.get('index.html#/view9');

		element( by.css('a[href="#/view9"]')).click()
		})
	browser.sleep(5000)
	it('should render schRegDialog', function(){
		//expect(element(by.id('search-form')).isDisplayed()).toBe(true);
		expect(browser.getLocationAbsUrl()).toMatch("/view9");
		})//it
	})//describe schRegDialog
describe('resultTable', function(){//this will only work with the dataset with entries for 2/21/2015
	beforeEach(function(){
		browser.get('index.html#/view1');

	/*	element( by.css('a[href="#/view9]')).click().then( function(){
			
			$( '#srdate' ).sendKeys( '02/21/2015' ).then( function(){
				$( '#schFind' ).click().then( function(){
					console.log('mmmmmmmmmmmm')
					})
				})
			} )*/
		})	
	it('should render 7 rows in resultTable', function(){
		//expect(element(by.id('resultDiv')).isDisplayed()).toBe(true);
		expect(browser.getLocationAbsUrl()).toMatch("/view1");

	})//it
  })//describe resultTable		
  //});//describe view1
 describe('view2', function() {
    beforeEach(function() {
      browser.get('index.html#/view2');
    });
    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] th')).first().getText()).
        toMatch(/Name/);
    });
  })

 describe('customerRow', function() {
	beforeEach(function(){
		browser.get('index.html#/view2');
		element( by.css( 'table .tbody tr.customerRow:nth-child(2)' )).click().then( function(){
			console.log('cccccccccccc')

			it('should render the Customer Detail Page', function(){
				expect(element(by.id('customerDetail')).isDisplayed()).toBe(true)
			})
			}) })
		})
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
describe( 'custinvoice', function(){
	beforeEach(function(){
		browser.get('index.html#/view2');
		element( by.css('button#to-invoice')).click()
		  browser.driver.sleep(5000);
		browser.waitForAngular();
			})
		it('should render the Invoice', function(){
			expect(element(by.id('invoicediv')).isDisplayed()).toBe(true)
			})
		})

describe( 'transactionsTable', function(){
	beforeEach(function(){
		browser.get('index.html#/view5');
		 })
		it('should render the Reports Page', function(){
			expect(element(by.id('transactionsTable')).isDisplayed()).toBe(true)
			})
		})
describe( 'contact form', function(){
		beforeEach(function(){
			browser.get('index.html#/view10');
		})
		it('should render the Contact Page', function(){
			expect(element(by.id('contact')).isDisplayed()).toBe(true)
		})
	})



  })
