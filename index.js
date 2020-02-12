const express = require("express")
const mongoose = require("mongoose")
const passport = require("passport")
const cors = require("cors")
const userRouter = require("./src/routers/userRouter")
const auth = require("./src/utils/auth")


mongoose.connect("mongodb://127.0.0.1:27017/m8", { useNewUrlParser: true, useUnifiedTopology: true }, (err) => console.log(err ? err : "Mongo Connected"))

const server = express();

server.use(cors())
server.use(express.json())
server.use(passport.initialize())

server.use("/user", userRouter)


server.listen(process.env.PORT || 3451, ()=> console.log("Web Server is running"))