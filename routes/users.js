const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../../../practice/Codeial/models/user');
const userController = require('../controllers/users_controller');



router.get('/',userController.home);
router.get('/sign-out',userController.destroySession);
router.post('/create',userController.create);
router.get('/sign-in',userController.signIn);
router.get('/sign-up',userController.signUp);
router.get('/restricted',userController.restricted);
router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.get('/permission',passport.checkAdmin,userController.permissionPage);
router.post('/grant-permission/:id',userController.grant);
router.get('/add-emp',passport.checkAdmin,userController.userPage);
router.post('/add-employee',passport.checkAdmin,userController.addEmployee);
router.get('/all-employee',passport.checkAdmin,userController.allEmployee);
router.get('/edit/:id',userController.edit);
router.post('/update/:id',userController.update);
router.get('/make-admin/:id',userController.makeAdmin);
router.get('/remove-admin/:id',userController.removeAdmin);
router.get('/del/:id',userController.deluser);
// router.post('/update/:id',userController.update);

//user passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
), userController.createSession);

module.exports = router;    