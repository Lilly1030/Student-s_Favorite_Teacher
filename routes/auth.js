const router = require("express").Router();
const Student = require("../models/Student");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken")

//Register
router.post("/register", async (req,res)=>{
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password,salt)
        const newStudent = new Student({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        });

        const student = await newStudent.save();
        const token = jwt.sign({username:student.username,id:student._id},process.env.SECRET_KEY)
        res.status(201).json({student:student,token:token});
    } catch (err) {
        res.status(500).json(err);
        // console.log(err)
    }
});


//Login
router.post("/login", async (req,res)=>{
    try{
        const student = await Student.findOne({username:req.body.username})
        !student && res.status(400).json("Wrong Credentials!!!")

        const validated = await bcrypt.compare(req.body.password, student.password)
        !validated && res.status(400).json("Wrong Credentials!!!")

        const {firstname,lastname,password, ...others} = student._doc;

        const token = jwt.sign({username:student.username,id:student._id},process.env.SECRET_KEY)
        res.status(201).json({...others,token:token});
        res.status(200).json(others)

    } catch (err) {
        res.status(500).json(err)
    }
});


module.exports = router