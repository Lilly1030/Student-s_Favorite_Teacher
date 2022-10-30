const router = require("express").Router();
const Favorite = require("../models/Favorite");
const Teacher = require("../models/Teacher");
const authtoken = require("../middlewares/authtoken");

//post the "username" and "favteachername" in the postman
router.post("/",authtoken,async (req, res)=>{
    const newFavorite = new Favorite(req.body);
    try{
        const fav = await Teacher.findOne({teachername:req.body.favteachername})
        if(!fav){
            res.status(400).json("No teacher exits with that name")
        }
        else{
            const savedFavorite = await newFavorite.save();
            res.status(200).json(savedFavorite);
        }
    }catch(err){
        res.status(500).json(err);
    }
    
});


// router.get("/",async (req,res)=>{
//     try{
//         const favorites = await Favorite.find();

//         res.status(200).json(favorites)
//     }
//     catch(err){
//         res.status(500).json(err)
//     }
// });



//Get all the favourites by the username or favorites of all the students
router.get("/",authtoken, async (req,res)=>{
    const username = req.query.username;
    
    try{
        let favs;
        if(username){
            favs = await Favorite.find({username});
        }
       
        else{
            favs = await Favorite.find();
        }
        res.status(200).json(favs);
    }catch(err){
        res.status(500).json(err);
    }
});


//Get the favorite count of all the teachers
router.get("/favcount",authtoken,async (req,res)=>{
    try {
        const favcount = await Favorite.aggregate([{$group:{_id:"$favteachername",no_of_favs:{$sum:1}}},{$sort: {no_of_favs:-1}} ])
        res.status(200).json(favcount);
    } catch (err) {
        res.status(500).json(err);
        
    }

})

//Get the most favorites teacher of the students
router.get("/mostfav",authtoken,async (req,res)=>{
    try {
        const mostfav = await Favorite.aggregate([{$group:{_id:"$favteachername",no_of_favs:{$sum:1}}},{$sort: {no_of_favs:-1}},{$limit : 1 }])
        res.status(200).json(mostfav);
    } catch (err) {
        res.status(500).json(err);
        
    }
})

//Delete the favorite teacher of a student
router.delete("/:id",authtoken,async (req,res)=>{
    if(req.body.favoriteId === req.params.id){
        try{
            try{
                await Favorite.findByIdAndDelete(req.params.id)
                res.status(200).json("Favorite has been deleted ...");
            } catch(err){
                res.status(500).json(err);
            }
        }catch(err){
            res.status(404).json("It is not one of your favorites!");
        }
    }
    else{
        res.status(401).json("You can delete only your accout!");
    }
});


module.exports = router

