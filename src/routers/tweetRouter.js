const express = require("express")
const Tweet = require("../models/tweet")
const passport = require("passport")
const objectId = require("mongoose").Types.ObjectId

const router = express.Router()

router.get("/", async (req, res) => {
    res.send(await Tweet.find())
})

router.post("/", passport.authenticate("jwt"), async(req, res)=>{
    req.body.userId = req.user._id
    const tweet = new Tweet(req.body)
    await tweet.save()
    res.send(tweet)
})

router.put("/:tweetId", passport.authenticate("jwt"), async(req, res)=>{
    const tweet = await Tweet.findById(req.params.tweetId)
    if (!tweet)
        return res.status(404).send("Not found")

    if (tweet.userId.toString() != req.user._id) //don't try this at home! we have to fix the conversion instad of using the cast
        return res.status(401).send("You can only modify your posts")

    const resp = await Tweet.findByIdAndUpdate(req.params.tweetId, {
        text: req.body.text
    })

    res.send(resp)
})

router.get("/myTweets", passport.authenticate("jwt"), async (req, res)=>{
    res.send(await Tweet
        .find({ userId: req.user._id})
        .sort("-updatedAt"))
})


module.exports = router;