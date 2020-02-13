const mongoose = require("mongoose")
const passportLocalMongoose = require("passport-local-mongoose")

const userSchema = new mongoose.Schema({
    role: String,
    facebookId: String,
    firstName: String,
    lastName: String,
    avatar: String,
    refreshToken: String
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("m8d3User", userSchema)

