const middleware = {};
const jsonwebtoken = require('jsonwebtoken');

middleware.isUser = async (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];

        if(!token){
            res.status(401).json({msg : "User is unauthorized"})
        }else{
            const decoded = await jsonwebtoken.verify(token, process.env.SECRET_KEY);
            console.log('decoded ',decoded);

            if(!decoded.isAdmin){
                req.user = decoded;
                next();
            }else{
                res.status(401).json({msg : "User is unauthorized"})
            }
        }
    }catch(e){
        console.log(e,"e")
        res.status(401).json({msg : "User is unauthorized"})
    }
}

middleware.isAdmin = async (req,res,next) =>{
    try{
        const token = req.headers.authorization.split(' ')[1];

        if(!token){
            res.status(401).json({msg : "User is unauthorized"})
        }else{
            const decoded = await jsonwebtoken.verify(token, process.env.SECRET_KEY);
            console.log('decoded ',decoded);

            if(decoded.isAdmin){
                req.user = decoded;
                next();
            }else{
                res.status(401).json({msg : "User is unauthorized"})
            }
        }
    }catch(e){
        console.log(e,"e")
        res.status(401).json({msg : "User is unauthorized"})
    }
}

module.exports = middleware;