const express = require('express');
const router = express.Router();
const {
  ensureAuthenticated,
  forwardAuthenticated
} = require('../config/auth');
const huser = require('../models/huser');


// Welcome Page
router.get('/',forwardAuthenticated,  (req, res) => res.render('index'));


// Dashboard
router.get('/dashboard', ensureAuthenticated, (req, res) =>
  res.render('dashboard', {
    fname: req.user.fname,
    lname: req.user.lname
  })
);

//exporting
module.exports=router;
