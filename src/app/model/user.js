const mongoose = require('../../database');

const bcrypt = require('bcryptjs')

const UserSchema = new mongoose.Schema({
    nickname:{
        type: String,
        unique: true,
        required: true,
        maxlength: 20
    },
    email:{
        type: String,
        unique: true,
        required: true,
        lowercase: true
    },
    password:{
        type: String,
        required: true,
        select: false
    },

    score:{
        type: Number,
        default:0
    },

    image:{
        type: String,
        default: ''
    },

    imageKey:{
        type: String
    },

    type:{
        type: String,
        default: "user",
        select: false
    },

    createdAt:{
        type: Date,
        default: Date.now,
        select: false
    }
});

UserSchema.pre('save', async function(next){
    const hash = await bcrypt.hash(this.password,10);
    this.password = hash;

    next();
});

const User = mongoose.model('User', UserSchema);

module.exports = User;