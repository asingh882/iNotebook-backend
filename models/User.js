const mongoose = require('mongoose');
const {Schema} = mongoose;

const UserSchema = new Schema ({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        requied: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },

});

const User = mongoose.model('user', UserSchema);
module.exports = mongoose.model('user', UserSchema);