const express = require('express');
const ejs = require('ejs');
const path = require('path');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');


// Passport Config
require('./config/passport')(passport);






// Init app
const app = express();





//connecting mongodb link
const MONGODB_URL ='mongodb+srv://EdwardCullen30:@S30n08y00@zwinger1-z4zgy.mongodb.net/test?retryWrites=true&w=majority';
//connecting
mongoose.connect(MONGODB_URL,  {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected!!!!');
});

//Public folder
app.use(express.static('public'));
// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);


// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());
// Global variables
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// EJS
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

//setting routes
app.use('/',require('./routes/index'));
app.use('/husers',require('./routes/husers'));



// Data parsing
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//starting connection
const port = 4000;
app.listen(port, () => console.log(`Server started on port ${port}`));
