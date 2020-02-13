const express = require("express")
const passport = require("passport")
const { getToken} = require("../utils/auth")

const router = express.Router()

router.get('/github',
  passport.authenticate('github'));

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('http://localhost:3000/callback?access_token=' + getToken({ _id: req.user._id}));
  });

router.get('/facebook',
  passport.authenticate('facebook'));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
          res.redirect('http://localhost:3000/callback?access_token=' + getToken({ _id: req.user._id}));
});

module.exports = router;