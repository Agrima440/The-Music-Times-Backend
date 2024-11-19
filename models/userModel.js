import  mongoose from'mongoose'
import  bcrypt from'bcryptjs'

const userSchema=mongoose.Schema({
name:{
    type:String,
    Required: [true,"Name is Required"]
},
email:{
type:String,
unique:true,
lowercase:true,
Required:[true,"Email is Required"]
},
password:{
    type:String,
    minlength:8,
    Required:[true,"Password is Required"]
},

role:{
    type:String,
    enum:["admin","user","guest"],
    // required:true,
    default:"user"
},
createdAt:{
    type: Date,
    default:Date.now
}

}
)

// userSchema.methods.matchPassword=async function(enterPassword){
//     return await bcrypt.compare(enterPassword,this.password)
// }

// //middleware for password
// userSchema.pre("save",async function(next){
//     if (!this.isModified("password")) {
//         next();
//       }
//       const salt = await bcrypt.genSalt(10);
//       this.password = await bcrypt.hash(this.password, salt);
// })

export default mongoose.model('User', userSchema)