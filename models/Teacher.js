const mongoose = require("mongoose");

const TeacherSchema = new mongoose.Schema({
      teachername : {
          type : String,
          required : true
      },
      subject : {
          type : String,
          required : true
      },
      years_of_experience : {
          type : Number,
          required : true
          
      },
      languages_good_at : {
          type : Array
      }
  }, {timestamps: true});


  module.exports = mongoose.model("Teacher",TeacherSchema);