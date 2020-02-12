const LocalStrategy = require("passport-local") // strategy to verify username and password
const UserModel = require("../models/user")
const passport = require("passport")

//1) We need to specify to passport how we are gonna handle serialization and deserialization of the UserModel
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

//2) We need to create and export our local strategy in order to verify username and password
module.exports = {
    local: passport.use(new LocalStrategy(UserModel.authenticate())) //this will check in the request body for username and password and verify them
}