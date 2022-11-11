import mongoose from 'mongoose'
import validator from 'validator'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'


const UserSchema = new mongoose.Schema({
    name: { 
        type: String,
        required: [true, 'Please provide name'],
        minlength: 2,
        maxlength: 100,
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please provide email'],
        validate:{
            validator: validator.isEmail,
            message: 'Please provide a valide email'
        },
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please provide password'],
        minlength: 6,
        select: false
    },
    lastName: {
        type: String,
        minlength: 2,
        maxlength: 20,
        trim: true,
        default: 'last name',
    },
    program: {
        type: String,
        minlength: 2,
        maxlength: 30,
        trim: true,
        default: 'institution',
    },
    linkedInProfile: {
        type: String,
        trim: true,
        default: 'myProfile'
    },
    phoneNumber: {
        type: String,
        maxlength: 20,
        trim: true,
        default: 'myNumber'
    }
})


UserSchema.pre('save', async function() {
    if (!this.isModified('password')) return
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
})

UserSchema.methods.createJWT = function () {
    return jwt.sign({userId: this._id}, process.env.JWT_SECRET, {expiresIn: process.env.JWT_LIFETIME})
}

UserSchema.methods.comparePassword = async function(candidatePassword){
    const isMatch = await bcrypt.compare(candidatePassword, this.password)
    return isMatch
}
export default mongoose.model('User', UserSchema)