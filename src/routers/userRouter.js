const express = require("express")
const UserModel = require("../models/user")
// const { local } = require("../utils/auth")
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
    
    res.send(req.user)
})

module.exports = router;