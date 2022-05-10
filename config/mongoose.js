const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/employeeReviewSysytem');

const db= mongoose.connection;

db.on('error',console.error.bind(console,"error in connecting to MngoDb"));
db.once('open',function(){
    console.log('Connected to Database :: MongoDB');
});


module.exports=db;