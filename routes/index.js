var SessionHandler = require('./session')
  , ContentHandler = require('./content')
  , ErrorHandler = require('./error').errorHandler;

module.exports = exports = function(app, db) {

    var sessionHandler = new SessionHandler(db);
    var contentHandler = new ContentHandler(app, db);

    // Middleware to see if a user is logged in
   // app.use(sessionHandler.isLoggedInMiddleware);
   
   

// Middleware to see if a user is logged in
app.use(sessionHandler.isLoggedInMiddleware);
/* GET home page. */

app.get('/', contentHandler.displayMainPage);
app.post('/newentry', contentHandler.handleNewEntry);
app.post('/edit', contentHandler.editRow)
app.post('/delete', contentHandler.deleteRow)
app.get( '/find', contentHandler.findRow )
app.get('/customers', sessionHandler.displayCustomersPage);
app.get( '/accounts', contentHandler.listAccounts )
app.get( '/results', contentHandler.editResults )
app.post( '/chkUpdate', contentHandler.chkUpdate )
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

app.use(ErrorHandler)
}
