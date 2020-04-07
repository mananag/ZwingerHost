const express = require('express');
const router = express.Router();
const passport = require('passport');
const huser = require('../models/huser');
const randomstring = require('randomstring');
const bcrypt = require('bcryptjs');
const mailer = require('../misc/mailer');
const { forwardAuthenticated } = require('../config/auth');
const { ensureAuthenticated } = require('../config/auth');









// Login Page
router.get('/login',forwardAuthenticated, (req, res) => res.render('login'));
// Register Page
router.get('/register',forwardAuthenticated,(req, res) => res.render('register'));


router.post('/register',(req,res)=>{
  const { fname,lname,address1,address2,city,state,pincode,email,pnum,password,password2} = req.body;

  let errors = [];

  if (!fname || !lname || !email || !password || !pnum ||  !password2 || !address1 || !address2 || !city || !state || !pincode) {
    errors.push({ msg: 'Please enter all fields' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match' });
  }

  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters' });
  }
  if (pincode.length != 6) {
    errors.push({ msg: 'Pin code is wrong' });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      fname,
      lname,
      address1,
      address2,
      city,
      state,
      pincode,
      email,
      pnum,
      password,
      password2
    });
  } else {
    huser.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'Email already exists' });
        res.render('register', {
          errors,
          fname,
          lname,
          address1,
          address2,
          city,
          state,
          pincode,
          email,
          pnum,
          password,
          password2
        });
      } else {
        // Generate secret token
        const secretToken = randomstring.generate({
          length:6,
          charset:'1234567890'
        });
        console.log('secretToken', secretToken);
        const active =  false ;

        var newhuser= new huser({
          fname,
          lname,
          address1,
          address2,
          city,
          state,
          pincode,
          email,
          pnum,
          password,
          secretToken,
          active



        });


        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newhuser.password, salt, (err, hash) => {
            if (err) throw err;
            newhuser.password = hash;
            newhuser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and go to verify'
                );
                // Compose email
                const html = `Hi there,this is swapnil from team zwinger
                <br/>
                Thank you for registering!
                <br/><br/>
                Please verify your email by typing the following token:
                <br/>
                Token: <b>${secretToken}</b>
                <br/>


                <br/><br/>
                Have a pleasant day.
                "JAY SHREE RAM"  `

                // Send email
                mailer.sendEmail('swapnil@ZWINGER.COM', email ,'Please verify your email!' , html);
                res.redirect('/husers/verify');
              })
              .catch(err => console.log(err));
          });
        });

      }
    });
  }


});


// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/husers/login',
    failureFlash: true
  })(req, res, next);
});
// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You are logged out');
  res.redirect('/husers/login');
});

router.route('/verify')
  .get(forwardAuthenticated, (req, res) => {
    res.render('verify');
  })
  .post(async (req, res, next) => {
    try {
      const { secretToken } = req.body;

      // Find account with matching secret token
      const user = await huser.findOne({ 'secretToken': secretToken });
      if (!user) {
        req.flash('error', 'No user found.');
        res.redirect('/husers/verify');
        return;
      }

      user.active = true;
      user.secretToken = '';
      await user.save();

      req.flash('success', 'Thank you! Now you may login.');
      res.redirect('/husers/login');
    } catch(error) {
      next(error);
    }
  })
















//exporting
module.exports=router;
