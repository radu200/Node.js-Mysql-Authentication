// app/routes.js
module.exports = function(app, passport) {

	// =====================================
	// HOME PAGE (with login links) ========
	// =====================================
	app.get('/', function(req, res) {
		console.log(req.user)
		res.render('index.ejs'); // load the index.ejs file
	});

	// =====================================
	// LOGIN ===============================
	// =====================================
	// show the login form
	app.get('/login', function(req, res) {

		// render the page and pass in any flash data if it exists
		res.render('login.ejs', { message: req.flash('loginMessage') });
	});

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		   //successRedirect:'/profile',
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
		}), 
        function(req, res,next) {
              if (req.user.type === 'basic'){
				return  res.redirect('/basic')
				  next();
			  }

			  if (req.user.type === 'advanced'){
				return res.redirect('/advanced')
               next();
			}
			if (req.user.type === 'customer'){
				 return res.redirect('/customer')
				next();
			}


            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

	// =====================================
	// SIGNUP ==============================
	// =====================================
	// show the signup form
	app.get('/signup/basic', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup_basic.ejs', { message: req.flash('signupMessage') });
	});
	app.get('/signup/advanced', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup_advanced.ejs', { message: req.flash('signupMessage') });
	});

	app.get('/signup/customer', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup_customer.ejs', { message: req.flash('signupMessage') });
	});

	app.get('/signup', function(req, res) {
		// render the page and pass in any flash data if it exists
		res.render('signup.ejs', { message: req.flash('signupMessage') });
	});



	// process the signup form
	app.post('/signup/basic', passport.authenticate('user-basic', {
		successRedirect : '/basic', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/signup/advanced', passport.authenticate('user-advanced', {
		successRedirect : '/advanced', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	app.post('/signup/customer', passport.authenticate('customer', {
		successRedirect : '/customer', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));
	// =====================================
	// PROFILE SECTION =========================
	// =====================================
	// we will want this protected so you have to be logged in to visit
	// we will use route middleware to verify this (the isLoggedIn function)
	app.get('/profile', isLoggedIn, function(req, res) {
		console.log(req.user.type)
		res.render('profile.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	app.get('/advanced',userAdvanced,isLoggedIn, function(req, res) {
		console.log(req.user.type)
		res.render('advanced.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	app.get('/basic',userBasic,isLoggedIn, function(req, res) {
		console.log(req.user.type)
		res.render('basic.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	app.get('/customer',customer,isLoggedIn, function(req, res) {
		console.log(req.user.type)
		res.render('customer.ejs', {
			user : req.user // get the user out of session and pass to template
		});
	});
	// =====================================
	// LOGOUT ==============================
	// =====================================
	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});
};

//route middleware for acces controll
function userBasic(req,res,next){
		if(req.user.type === 'basic'){
			return next();
		}else{
			res.redirect('/login')
		}
	}
	
	function userAdvanced(req,res,next){
		if(req.user.type === 'advanced'){
			return next();
		}else{
			res.redirect('/login')
		}
	}
	function customer(req,res,next){
		if(req.user.type === 'customer'){
			return next();
		}else{
			res.redirect('/login')
		}
	}
	// route middleware to make sure
	function isLoggedIn(req, res, next) {
		
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
		return next();
		
		// if they aren't redirect them to the home page
	res.redirect('/');
}
