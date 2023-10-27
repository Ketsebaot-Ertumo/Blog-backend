const mongoose= require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
// const uniqueValidator = require('mongoose-unique-validator');


const userSchema = new mongoose.Schema({
    // id: {
    //     type: Number,
    //     autoIncrement: true,
    //     unique:true,
    // },
    name:{
        type:String,
        required:[true, 'First name is required'],
        trim:true,
        min:3,
        maxlength:32
    },

    email:{
        type:String,
        trim: true,
        required:[true, 'email is required'],
        min:8,
        unique: true,
        dropDups: true
        
    },
    password:{
       type:String,
       trim: true,
       required:[true, 'password is required'],
       max:1024,
       min:[6,'Pasword must have at least 6 character.']
    },

//    date:{
//         type: Date,
//         default:Date.now
//     },

   role:{
        type: String,
        default:'user'
    },
   profilePicture: {
        //type: String,
        url: String,
        public_id: String,
        //default: '',
      }
//,
//    confirmationCode: {
//         type: String,
//         unique: true
//       },
//    isConfirmed: {
//         type: Boolean,
//         default: false
//       }
}, {timestamps:true})

//encrypting password before saving
userSchema.pre('save', async function (next){
    if (!this.isModified('password')){
        next();
    }
    this.password= await bcrypt.hash(this.password,10)
})

//compare user password
userSchema.methods.comparePassword= async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}

//return a JWT
userSchema.methods.getJwtToken = function (){
    return jwt.sign({ id: this.id,name: this.name,email:this.email}, process.env.JWT_SECRET, { expiresIn: '6hr' });
}

// // Add unique validator plugin
// userSchema.plugin(uniqueValidator, { message: 'Email already exists' });

// // Generate a unique confirmation code for the user
// userSchema.methods.generateConfirmationCode = function() {
//   const confirmationCode = Math.floor(100000 + Math.random() * 900000).toString();
//   this.confirmationCode = confirmationCode;
//   return confirmationCode;
// };

const User = mongoose.model('User', userSchema);

module.exports = User;

//module.exports = mongoose.model('User', userSchema)
