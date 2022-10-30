const router = require("express").Router();
const Student = require("../models/Student")
const bcrypt = require("bcrypt");
const Favorite = require("../models/Favorite")

//Edit student details
router.put("/:id",async (req,res)=>{
    if(req.body.studentId === req.params.id){
        if(req.body.password){
            const salt = await bcrypt.genSalt(10);
            req.body.password = await bcrypt.hash(req.body.password,salt);
        }
        try{
            const updatedStudent = await Student.findByIdAndUpdate(req.params.id,{
                $set:req.body,
            },{new:true});
            res.status(200).json(updatedStudent)
        }catch(err){
            res.status(500).json(err);
        }
    }
    else{
        res.status(401).json("You can update only your accout!!!")
    }
})

//Delete the student details
router.delete("/:id",async (req,res)=>{
    if(req.body.studentId === req.params.id){
        try{
            const student = await Student.findById(req.params.id);
            try{
                await Favorite.deleteMany({username:student.username})
                await Student.findByIdAndDelete(req.params.id)
                res.status(200).json("User has been deleted ...");
            } catch(err){
                res.status(500).json(err);
            }
        }catch(err){
            res.status(404).json("User not found!");
        }
    }
    else{
        res.status(401).json("You can delete only your accout!");
    }
    
});


module.exports = router