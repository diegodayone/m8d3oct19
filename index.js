const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const cors = require("cors")
const userRouter = require("./src/routers/userRouter")
const tweetRouter = require("./src/routers/tweetRouter")
const dotenv = require("dotenv")
dotenv.config()
const { getToken } = require("./src/utils/auth")

mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => console.log(err ? err : "Mongo Connected"))

const server = express();

server.use(cors())
server.use(express.json())
server.use(passport.initialize())

server.use("/user", userRouter)
server.use("/tweets", tweetRouter)

server.get('/auth/facebook',
  passport.authenticate('facebook'));const express = require("express")
  const mongoose = require("mongoose")
  const passport = require("passport")
  const cors = require("cors")
  const userRouter = require("./src/routers/userRouter")
  const tweetRouter = require("./src/routers/tweetRouter")
  const authRouter = require("./src/routers/authRouter")
  const dotenv = require("dotenv")
  dotenv.config()
  const auth = require("./src/utils/auth")
  
  mongoose.connect(process.env.MONGODB, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => console.log(err ? err : "Mongo Connected"))
  
  const server = express();
  
  server.use(cors())
  server.use(express.json())
  server.use(passport.initialize())
  
  server.use("/user", userRouter)
  server.use("/tweets", tweetRouter)
  server.use("/auth", authRouter)
  
  server.listen(process.env.PORT || 3451, ()=> console.log("Web Server is running"))
  

server.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: 'http://localhost:3000/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/?access_token=" + getToken({ _id: req.user._id }));
  });

server.get('/auth/github',
  passport.authenticate('github'));

server.get('/auth/github/callback', 
  passport.authenticate('github', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000/?access_token=" + getToken({ _id: req.user._id }));
});

server.listen(process.env.PORT || 3451, ()=> console.log("Web Server is running"))