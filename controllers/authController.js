import User from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/////////////////////// register  ////////////////////

export const registerUser = async (req, res) => {
  try {
    const { name, email, password,role } = req.body;
    // validation
    if (!name) {
      return res.send({ error: "Name is Required" });
    }
    if (!email) {
      return res
        .status(404)
        .send({ error: "Email is Required", success: false });
    }
    if (!password) {
      return res.send({ error: "Password is Required" });
    }
    // check user
    let user = await User.findOne({ email });

    // existing user
    if (user) {
      return res.status(200).send({
        success: false,
        message: "User Already Register, please login !",
      });
    }
    const hashPass = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashPass,role });
    if (user) {
      res.status(201).json({
        // _id:user._id,
        // name:user.name,
        // email:user.email,
        // isAdmin:user.isAdmin,
        message: "User Registered Successfully",
        user,
        success: true,
      });
    } else {
      res.status(404);
      throw new Error("User Not Found");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Registration",
      error,
    });
  }
};
///////////////////// Login ///////////////////..

export const loginController = async (req, res) => {
  const { email, password, role } = req.body;

  try {
    if (!email) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Email!",
      });
    }
    if (!password) {
      return res.status(404).send({
        success: false,
        message: "Please Provide Password!",
      });
    }
    let user = await User.findOne({ email });
    if (!user) return res.json({ message: "User not find", success: false });
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword)
      return res.json({ message: "Invalid Credential", success: false });

    const token =  jwt.sign({ _id: user._id }, process.env.JWT_KEY, {
      expiresIn: "7d",
    });
    res.status(200).cookie("token",token,{
      expires:new Date(Date.now()+ 15*24*60*60*1000),
      secure:process.env.NODE_ENV==="development"? true:false,
      httpOnly:process.env.NODE_ENV==="development"? true:false,
      sameSite:process.env.NODE_ENV==="development"? true:false,
    }).send({
      success: true,
      message: `Welcome ${user.name} to The Music Times`,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in Login",
      error,
    });
  }
};

export const usersController = async (req, res) => {
  try {
    let users = await User.find({ _id: { $ne: req.user._id } }).sort({
      createdAt: -1,
    });
    res.json(users);
  } catch (error) {
    res.json(error.message);
  }
};

export const logoutController=async(req,res)=>{
  try{
res.clearCookie("token")
res.status(200).send({
  success:true,
  message:"Logged Out Successfully",
})
  }
  catch(error){
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while logging out",
      error,
    });
  }
}

//  Auth by google

// export const loginSuccessController=async(req,res)=>{
//   try{
//     if (req.user) {
//       res.status(200).json({
//         error: false,
//         message: "Successfully Loged In",
//         user: req.user,
//       });
//     } else {
//       res.status(403).json({ error: true, message: "Not Authorized" });
//     }
//   }
//   catch(error){
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in Login Success Controller",
//       error,
//     });
//   }
// }

// export const loginFailedController=async(req,res)=>{
//   try{
//     res.status(401).json({
//       error: true,
//       message: "Log in failure",
//     });
//   }
//   catch(error){
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in Login Failed Controller",
//       error,
//     });  
//   }
// }

// export const googleAuthenticateController=async(req,res)=>{
//   try{
//     passport.authenticate("google", {
//       successRedirect: process.env.CLIENT_URL,
//       failureRedirect: "/login/failed",
//     })
//   }
//   catch(error){
//     console.log(error);
//     res.status(500).send({
//       success: false,
//       message: "Error in Login Failed Controller",
//       error,
//     });  
//   }
// }