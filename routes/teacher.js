const router = require("express").Router();
const Teacher = require("../models/Teacher");
const Favorite = require("../models/Favorite")


//Post new teacher details
router.post("/",async (req, res)=>{
    const newTeacher = new Teacher(req.body);
    try{
        const savedTeacher = await newTeacher.save();
        res.status(200).json(savedTeacher);
    }catch(err){
        res.status(500).json(err);
    }
    
});

//Edit the teacher details
router.put("/:id",async (req,res)=>{
    if(req.body.teacherId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password,salt);
        }
        try{
            const updatedTeacher = await Teacher.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{new:true});
            res.status(200).json(updatedTeacher)
        }catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(401).json("You dont have the access to change this !")
    }
})


// Delete the teacher details
router.delete("/:id",async (req,res)=>{
    if(req.body.teacherId === req.params.id){
        try{
            const teacher = await Teacher.findById(req.params.id);
            try{
                await Favorite.deleteMany({favteachername:teacher.teachername})
                await Teacher.findByIdAndDelete(req.params.id)
                res.status(200).json("Teacher has been deleted ...");
            } catch(err){
                res.status(500).json(err);
            }
        }catch(err){
            res.status(404).json("Teacher not found!");
        }
    }
    else{
        res.status(401).json("You can delete only your accout!");
    }
});

//Get all teacher details
router.get("/",async (req,res)=>{
    try{
        const teachers = await Teacher.find();

        res.status(200).json(teachers)
    }
    catch(err){
        res.status(500).json(err)
    }
});

module.exports = router


