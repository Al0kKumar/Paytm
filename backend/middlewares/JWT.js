const jwt = require('jsonwebtoken');

const authmiddleware = (req,res,next) => {

   const authHeader = req.headers['authorization'];

   if(!authHeader){
    return res.status(401).json({msg:"Authorization header missing"})
   }

   const parts = authHeader.split(' ');
   

   //it means the header is not of this format - ["Bearer","<token>"]
   if(parts.length !== 2 || parts[0] !== 'Bearer'){
    return res.status(401).json({
        msg: "Authorization header format must be Bearer <token>"
    })
   }

   const token = parts[1];

   jwt.verify(token, process.env.JWT_SECRET, (err,user) => {
      if(err){
        return res.status(401).json({msg:"Unauthorized"})
      }
       
      req.user = user;
      next();
   })
};


module.exports = authmiddleware;