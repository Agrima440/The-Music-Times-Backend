import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
// export const requireSignIn=async(req,res,next)=>{
//   try{
// const decode=jwt.verify(req.headers.authorization,process.env.JWT_KEY);
// req.user=decode;
// next();
//   }
//   catch(error){
// console.log("error in token ", error)
//   }
// }

export const requireSignIn = async (req, res, next) => {
  try {
    const {token}=req.cookies
    //validation
    if(!token){
      res.status(401).send({
        success:false,
        message:"UnAuthorized User"
      })
    }
    const decode = jwt.verify(token, process.env.JWT_KEY);
    req.user = decode;
    next();
  } catch (error) {
    console.log("Error in token verification:", error);
    return res.status(401).send({
      success: false,
      message: "Authentication failed",
    });
  }
};


export const checkRole = (roles) => {
  return async (req, res, next) => {
    try {
      const user = await User.findById(req.user._id);
      // console.log(user);

      // Check if the user has one of the required roles
      if (!roles.includes(user.role)) {
        return res.status(401).send({
          success: false,
          message: "Unauthorized Access",
        });
      }
      next();
    } catch (error) {
      console.log("Error in checkRole Middleware", error);
      res.status(400).send({
        success: false,
        message: "Error in role middleware",
        error,
      });
    }
  };
};

