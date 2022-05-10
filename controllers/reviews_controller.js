const Review = require('../models/review');
const User = require('../models/user');


//reneder the all review in a page
module.exports.home = async function (req, res) {
    try{
        //populate user of each review
        let review = await Review.find({})
        .populate('reviewBy');

        let users = await User.find({});

        return res.render('all_review',{
            title:"All Reviews",
            reviews:review,
            all_users:users
        });

    }
    catch(err){
        console.log("Error",err);
        return
    }

}


module.exports.add = function (req, res) {
    User.find({},(err,user)=>{
        if(err){
            console.log('Unable to find any user for review: ',err);
        }
        return res.render('add_review', {
            title: "Add review",
            users: user
        });
    });
    
}


module.exports.create = async function (req, res) {
    try{
        if(req.user.permission.includes(req.params.id) || req.user.admin){
            var review = await Review.create({
                content:req.body.review,
                reviewBy:req.user.id
            });
            User.findById(req.params.id,function(err,user){
                user.myReviews.push(review.id);
                user.save();
            })
                req.flash('success','Review Published!');
                return res.redirect('back');

        }
        else{
            req.flash('error','Sorry you cant review this user');
            return res.redirect('back');
        }
        
        
    }
    catch(err){
        req.flash('error','Error in publishing review');
            return res.redirect('back');
    }
    
}