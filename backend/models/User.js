const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        enum: ['client', 'developer'],
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    //Profile Fields.....

    bio: { type: String },
    skills: [String],
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String },


    //client profile fields
    company: { type: String },
    companyLogo: { type: String },
    contact: { type: String },

}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
