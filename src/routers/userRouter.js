const express = require("express")
const UserModel = require("../models/user")
const { getToken } = require("../utils/auth")
const passport = require("passport")

const router = express.Router()

router.post("/signup", async (req, res) => {
    try{
        const user = await UserModel.register(req.body, req.body.password)
        res.send(user)
    }
    catch(exx){
        console.log(exx)
        res.status(500).send(exx)
    }
})

router.post("/signin", passport.authenticate("local"), async(req, res)=>{
    //if we have some right credentials
    //we can forge a new secure access token for the user
    //we can save arbitrary info into the token

    // const randomToken = jwt.sign({ username: req.user.username}, process.env.TOKEN_PASSWORD, { expiresIn: 3600 })
    const token = getToken({ _id: req.user._id })
    res.send({
        access_token: token,
        user: req.user,
        success: true,
        message: "User successfully logged in"
    })
})

router.get("/bankaccounts", passport.authenticate("jwt"), async (req, res)=>{

    res.send(req.user);
})

module.exports = router;