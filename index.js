const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require('mongoose');

const authRoute = require("./routes/auth")
const teacherRoute = require("./routes/teacher")
const favoriteRoute = require("./routes/favorite")
const studentRoute = require("./routes/student")

dotenv.config();
app.use(express.json());

app.use((req,res,next)=>{
    console.log("HTTP Method - " + req.method + "URL - " + req.url);
    next()
})

mongoose.connect(process.env.MONGO_URL,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(console.log("Connected to MongoDB"))
.catch((err)=>console.log(err));


app.use("/api/auth", authRoute)// "/register" for registration and "/login" for logging in
app.use("/api/teacher",teacherRoute) // "/:id" for put and delete, "/" for get and post
app.use("/api/favorites",favoriteRoute) // "/" for post, "/?username=bob123" for get, "/mostfav" for getting most favorite teacher
app.use("/api/student",studentRoute) // "/:id" for put and delete

app.listen("5000",()=>{
    console.log("Backend is running ...");
});