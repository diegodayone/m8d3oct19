const LocalStrategy = require("passport-local") // strategy to verify username and password
const JwtStrategy = require("passport-jwt").Strategy // strategy to verify the access token
const ExtractJwt = require("passport-jwt").ExtractJwt // this is a helper to extract the info from the token
const UserModel = require("../models/user")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

//1) We need to specify to passport how we are gonna handle serialization and deserialization of the UserModel
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

console.log('env', process.env.TOKEN_PASSWORD, process.env.MONGODB)

//-----------------JWT AREA-------------------------------------
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Authorization: Bearer TOKEN
    secretOrKey: process.env.TOKEN_PASSWORD //
}
//-----------------JWT AREA-------------------------------------

//2) We need to create and export our local strategy in order to verify username and password
module.exports = {
    local: passport.use(new LocalStrategy(UserModel.authenticate())), //this will check in the request body for username and password and verify them
    //-----------------JWT AREA-------------------------------------
    jwtPassport: passport.use(new JwtStrategy(jwtOptions, (jwtPayload, callback) =>{
        UserModel.findById(jwtPayload._id, (err, user) => {
            if (err) return callback(err, false) // ==> Something went wrong getting the info from the db
            else if (user) return callback(null, user) // ==> Existing user, all right!
            else return callback(null, false) // ==> Non existing user
        })
    })),
    getToken: (user) => jwt.sign(user, jwtOptions.secretOrKey, { expiresIn: 3600 }) //this is just an helper to have a central point for token generation
    //-----------------JWT AREA-------------------------------------
}