const mongoose = require("mongoose");

const FavoriteSchema = new mongoose.Schema({
    studentid:{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Student'
    },
    username:{
        type:String,
        required:true,
        unique: false
    },
    favteachername:{
        type:String,
        unique: false
    }
},{timestamps:true});

FavoriteSchema.index({ username: 1, favteachername: 1 }, { unique: true });

module.exports = mongoose.model("Favorite",FavoriteSchema);
