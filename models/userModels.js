
const mongoose= require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');




const userSchema = new mongoose.Schema({
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
        dropDups: true,
        match: ['/\w(SE%RTYUI$%6yhO)@\w+(&Y))({2,)/', 'Please add a valid email']
    },
    password:{
       type:String,
       trim: true,
       required:[true, 'password is required'],
       max:1024,
       min:[6,'Pasword must have at least 6 character.']
    },

   date:{
        type:Date,
        default:Date.now
    },

   role:{
        type: String,
        default:'user'
    }
}, {timestamps:true}
);

//encrypting password before saving
userSchema.pre('save', async function (next){
    if (!this.isModified('password')){
        next();
    }
    this.password= await bcrypt.hash(this, this.password,10)
})

//compare user password
userSchema.methods.comparePassword= async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password);
}

//return a JWT
userSchema.methods.getJwtToken = function (){
    return jsonWebTokenError.sign({ id: this.id}, process.env.JWT_SECRET, {expiresIn: 3600});
}

module.exports = mongoose.model('User', userSchema)
