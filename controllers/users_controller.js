const User = require('../models/user');
const Review = require('../models/review');

//render the user home page
module.exports.home = function (req, res) {
    return res.redirect('/');
}


//render menu admin style
module.exports.nav = function (req, res) {
    User.find({}, (err, user) => {
        return res.render('_header', {
            all_user: user
        })
    })
}

// signing in for data and generate session
module.exports.createSession = function (req, res) {
    req.flash('success', 'Logged in Successfully');
    return res.redirect('/');


}
//render if the user is not admin
module.exports.restricted = function (req, res) {
    return res.render('restricted', {
        title: "Unauthorized User"
    });
}
//siging out using passport
module.exports.destroySession = function (req, res) {
    req.logout();
    req.flash('success', 'Logged out Successfully');
    return res.redirect('/');
}

//render the user sign in page
module.exports.signIn = function (req, res) {
    if (req.isAuthenticated()) {
        User.findById(req.params.id, function (err, user) {
            return res.redirect('/');
        });

    }
    return res.render('user_sign_in', {
        title: "Employee Review | Sign In"
    });
}


//render the user sign up page
module.exports.signUp = function (req, res) {

    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return res.render('user_sign_up', {
        title: "Employee Review | Sign Up"
    })
}






// Pushing the sign up for to DB
module.exports.create = function (req, res) {
    //validate confirm password
    if (req.body.password != req.body.confirm_password) {
        window.alert('Password does not match');
        return res.redirect('back');
    }
    //check if the user exists
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('error in finding user in signing up'); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log('error in creating user in signing up'); return }

                return res.redirect('/users/sign-in');
            });
        }
        else {
            return res.redirect('back');
        }
    });

}

//render the user to permisson grant page
module.exports.permissionPage = function (req, res) {
    try {
        if (!req.isAuthenticated()) {
            return res.redirect('/users/sign-in');
        }
        User.find({}, function (err, user) {
            return res.render('grant_permission', {
                title: "Grant permission",
                users: user
            });
        });

    }
    catch (err) {
        console.log('Error in redirecting page: ', err);
        return;
    }
}

//render to user profile
module.exports.profile = async function (req, res) {
    try {
        let user = await User.findById(req.params.id)
            .populate({
                path: 'myReviews',
                populate: {
                    path: 'reviewBy'
                }
            });

        return res.render('user_profile', {
            title: "User Profile/Reviews",
            profile_user: user
        });

    }
    catch (err) {
        console.log('Error in fetching profile: ', err);
        return;
    }
}

//render to add user profile
//only for admin
module.exports.userPage = function (req, res) {
    return res.render('add_employee', {
        title: "Add User"
    })

}

//Granting the permission to every specific user
module.exports.grant = async function (req, res) {
    if (req.body.length > 1) {
        for await (i of req.body.userId) {
            User.findById(i, function (err, user) {
                if (!user.permission.includes(req.params.id)) {
                    user.permission.push(req.params.id);
                    user.save();
                }

            });
        }
    }
    else {
        User.findById(req.body.userId, function (err, user) {
            if (!user.permission.includes(req.params.id)) {
                user.permission.push(req.params.id);
                user.save();
            }
        });

    }

    return res.redirect('back');
}


//Adding a Employee(Only for admin account)
module.exports.addEmployee = function (req, res) {
    //check if the employee exists
    User.findOne({ email: req.body.email }, function (err, user) {
        if (err) { console.log('error in finding employee'); return }

        if (!user) {
            User.create(req.body, function (err, user) {
                if (err) { console.log('error in creating user in signing up'); return }
                req.flash('success', 'Employee added!');
                return res.redirect('back');
            });
        }
        else {
            return res.redirect('back');
        }
    });
}

//render all the employee to page
module.exports.allEmployee = function (req, res) {
    User.find({}, function (err, emp) {
        return res.render('all_employee', {
            title: "All Employees",
            employee: emp
        })
    })
}

//edit or update the user
module.exports.edit = function (req, res) {
    User.findById(req.params.id, function (err, user) {
        if (req.user.id == req.params.id || req.user.admin) {
            return res.render('user_edit', {
                title: "User Edit",
                user: user
            });
        }
        return res.redirect('/users/restricted')

    })
}

//update the user profile itself or the admin can change anyones
module.exports.update = async function (req, res) {
    if (req.user.id == req.params.id) {
        try {
            User.findById(req.params.id, function (err, user) {
                user.name = req.body.name;
                user.email = req.body.email;
                user.save();
                req.flash('success', 'Updated Successfully!');
                return res.redirect('back');
            })

        }
        catch (err) {
            console.log('error', err);
            return res.redirect('back');
        }
    }
    else {
        return res.redirect('/users/restricted')
    }

}


//making the admin by the admin
module.exports.makeAdmin = async function (req, res) {
    if (req.user.admin) {
        try {
            User.findById(req.params.id, function (err, user) {
                user.admin = true;
                user.save();
                req.flash('success', 'Admin Updated Successfully!');
                return res.redirect('back');
            })
        }
        catch (err) {
            console.log('error', err);
            return res.redirect('back');
        }
    }
    else {
        return res.redirect('/users/restricted');
    }
}


//Removing the admin role  by the admin
module.exports.removeAdmin = async function (req, res) {
    if (req.user.admin) {
        try {
            User.findById(req.params.id, function (err, user) {
                user.admin = false;
                user.save();
                req.flash('success', 'Admin Updated Successfully!');
                return res.redirect('back');
            })
        }
        catch (err) {
            console.log('error', err);
            return res.redirect('back');
        }
    }
    else {
        return res.redirect('/users/restricted');
    }
}

//Removing the user by the admin
module.exports.deluser = async function (req, res) {
    if (req.user.admin) {
        try {
            User.findById(req.params.id, function (err, user) {

                Review.deleteMany({'_id':user.myReview}, function (err) {


                });
                user.remove();
                return res.redirect('back');
            })
        }
        catch (err) {
            console.log('error', err);
            return res.redirect('back');
        }
    }
    else {
        return res.redirect('/users/restricted');
    }
}