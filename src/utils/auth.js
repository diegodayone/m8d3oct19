const LocalStrategy = require("passport-local") // strategy to verify username and password
const JwtStrategy = require("passport-jwt").Strategy // strategy to verify the access token
const FbStrategy = require("passport-facebook-token") // strategy to verify facebook token
const ExtractJwt = require("passport-jwt").ExtractJwt // this is a helper to extract the info from the token
const UserModel = require("../models/user")
const passport = require("passport")
const jwt = require("jsonwebtoken")
const dotenv = require("dotenv")
dotenv.config()

//1) We need to specify to passport how we are gonna handle serialization and deserialization of the UserModel
passport.serializeUser(UserModel.serializeUser())
passport.deserializeUser(UserModel.deserializeUser())

passport.use(new LocalStrategy(UserModel.authenticate())) // this strategy will be used when we ask passport to passport.authenticate("local")

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //Authorization: Bearer TOKEN
    secretOrKey: process.env.TOKEN_PASSWORD //
}

passport.use(new JwtStrategy(jwtOptions, (jwtPayload, callback) =>{ //this strategy will be used when we ask passport to passport.authenticate("jwt")
    UserModel.findById(jwtPayload._id, (err, user) => { //looks into the collection
        if (err) return callback(err, false) // ==> Something went wrong getting the info from the db
        else if (user) return callback(null, user) // ==> Existing user, all right!
        else return callback(null, false) // ==> Non existing user
    })
    // try{
    //     const user = await UserModel.findById(jwtPayload._id)
    //     if (user)
    //         return callback(null, user)
    //     else 
    //         return callback(null, false)
    // }   
    // catch(exx){
    //     return callback(exx, false)
    // } 
}))

passport.use("fb", new FbStrategy({ 
    clientID: process.env.FB_ID,
    clientSecret: process.env.FB_KEY
}, async (accessToken, refreshToken, facebookProfile, next) =>{
    //console.log(accessToken)
    console.log(facebookProfile)

    //we can check if we have a user with the given facebookId or create a new user with the information we are receiving from facebook!
    //search for a user with the given FB ID
    try{
        console.log(facebookProfile.id)
        const userFromFacebookId = await UserModel.findOne({ facebookId: facebookProfile.id})
        if (userFromFacebookId)
            return next(null, userFromFacebookId)
        else
        {
            const newUser = await UserModel.create({
                role:"User",
                facebookId: facebookProfile.id,
                username: facebookProfile.emails[0].value,
                firstName: facebookProfile.name.givenName,
                lastName: facebookProfile.name.familyName,
                avatar: facebookProfile.photos[0].value
            })
            return next(null, newUser) // => Not found!
        }
        //return next(null, userFromFacebookId || false)
    }
    catch(exx){
        return next (exx)
    }
}))

module.exports = {
    getToken: (user) => jwt.sign(user, jwtOptions.secretOrKey, { expiresIn: 3600 }) //this is just an helper to have a central point for token generation
}