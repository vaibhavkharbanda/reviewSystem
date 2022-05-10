const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');


//Authetication using passport
passport.use(new LocalStrategy({
    usernameField: 'email',
    passReqToCallback:true
},

    function (req,email, password, done) {
        //find the user and establish the identity
        User.findOne({ email: email }, function (err, user) {
            if (err) {
                req.flash('error',err);
                return done(err);
            }
            if (!user || user.password != password) {
                req.flash('error', "Invalid Username/Password");
                return done(null, false);

            }
            return done(null, user);

        });

    }
));

//serializing the user to decide which key is to be kept in the cookies 

passport.serializeUser(function(user,done){
    done(null, user.id);
});


//deserializing the user from the key  in the cookies 
passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        if (err) {
            console.log('Error in finding user ---> Passport');
            return done(err);
        }
        return done(null, user);
    });
});



//check if the user is authenticated

passport.checkAuthentication = function(req,res,next){
    if(req.isAuthenticated()){
        return next();
    }

    //if the user is not signed in

    return res.redirect('/users/sign-in');
}

//check if user is admin or not
passport.checkAdmin = function(req,res,next){
    if(req.user.admin==true){
        return next();
    }
    // if user is not a admin
    req.flash('error','You are not authorized');
    return res.redirect('/users/restricted');

}

passport.setAuthenticatedUser= function(req,res,next){
    if(req.isAuthenticated()){
        //req.user contains the current signed in user from the session cookie and we are just sending this to the locals from the views
        // console.log(res);
        res.locals.user=req.user;
    }
    next();
}

module.exports = passport;