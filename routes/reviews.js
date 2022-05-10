const express = require('express');
const router = express.Router();
const passport = require('passport');
const reviewController = require('../controllers/reviews_controller');


router.get('/',passport.checkAdmin,reviewController.home);
router.get('/add',passport.checkAuthentication,reviewController.add);
router.post('/create/:id',passport.checkAuthentication,reviewController.create);



module.exports = router;