// models/User.js

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    token: {
        type: String,
        default: null
    }
}, {
    timestamps: true
});

// ============================================
// PRE-SAVE MIDDLEWARE: Hash password before saving
// FIXED: Removed 'next' parameter - not needed with async/await in Mongoose 5+
// ============================================
userSchema.pre('save', async function() {
    // Only hash if password is modified (or new)
    if (!this.isModified('password')) {
        return;
    }
    
    // Generate salt and hash the password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// ============================================
// INSTANCE METHOD: Compare passwords
// ============================================
userSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// ============================================
// INSTANCE METHOD: Remove sensitive data when converting to JSON
// ============================================
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    delete user.token;
    return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;