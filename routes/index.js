var SessionHandler = require('./session')
  , ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler
  , SendEmail = require('./send');
module.exports =

    function(app, db) {
    var sessionHandler = new SessionHandler(db);
    var contentHandler = new ContentHandler(app, db);
    var sendEmail = new SendEmail();

// Middleware to see if a user is logged in
app.use(sessionHandler.isLoggedInMiddleware);
/* GET home page. */

app.get('/', contentHandler.displayLayout);
app.get('/entries', contentHandler.displayMainPage);
app.post('/newentry', contentHandler.handleNewEntry);
app.post('/delete', contentHandler.deleteRow)
app.get( '/find', contentHandler.findRow )
app.get('/customers', contentHandler.displayCustomersPage);
app.get('/customer', contentHandler.getCustomer);
app.post('/newCustomer', contentHandler.newCustomer);
app.post('/customerUpdate', contentHandler.customerUpdate)
app.get( '/accounts', contentHandler.listAccounts )
app.post( '/chkUpdate', contentHandler.chkUpdate )
app.post( '/newInvoice', contentHandler.newInvoice )
app.get( '/invoice', contentHandler.getInvoice )
app.get( '/services', contentHandler.listServices )
app.get( '/transactions', contentHandler.listTransactions )
        app.post( '/contact', contentHandler.contactForm )



        console.log("HERE")

app.get('/home', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

app.get('/login', sessionHandler.displayLoginPage);
app.post('/login', sessionHandler.handleLoginRequest);

    // Logout page
app.get('/logout', sessionHandler.displayLogoutPage);

    // Welcome page
 app.get("/welcome", sessionHandler.displayWelcomePage);

    // Signup form
app.get('/signup', sessionHandler.displaySignupPage);
app.post('/signup', sessionHandler.handleSignup);
app.post('/sendemail', sendEmail.send);
app.post('/test', contentHandler.test);
        app.options('/test', contentHandler.test);
app.use(ErrorHandler)
}
