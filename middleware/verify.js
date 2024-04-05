const jwt = require('jsonwebtoken');

const verifyToken = async(req,res,next)=>{
    try {
        const token = req.headers['authorization'];
        jwt.verify(token,"hello",(err,decoded)=>{
            if(err){
                console.log(err.message);
                    return
            }else{
                req.userId = decoded.id;
                next();
                
            }
        });
        
    } catch (error) {
        console.log(error.message)
    }
};


module.exports = verifyToken;