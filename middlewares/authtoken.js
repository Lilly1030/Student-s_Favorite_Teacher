const jwt = require("jsonwebtoken")

const authtoken = (req,res,next)=>{
    try{
        let token = req.headers.authorization;
        if(token){
            token = token.split(" ")[1];
            let user = jwt.verify(token,process.env.SECRET_KEY)
            req.userId = user.id;
        }
        else{
            res.status(401).json("Unauthorized User");
        }

        next();
    }
    catch(err){
        res.status(401).json("Unauthorized User");
    }
}

module.exports = authtoken