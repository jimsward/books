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
		//expect( browser.getTitle()).toMatch( /Check Register Entry/ )
		expect(element(by.id('datepicker2')).isDisplayed()).toBe(true); 
		})//it
	})//describe chkEntryDlg
	
	
  });//describe view1
  
  
  
  
  



  describe('view2', function() {

    beforeEach(function() {
      browser.get('index.html#/view2');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] p')).first().getText()).
        toMatch(/partial for view 2/);
    });

  });
});
