const mongoose = require('mongoose');

// Clear any existing models to prevent OverwriteModelError
mongoose.models = {};
mongoose.modelSchemas = {};

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true,
    collection: 'users', // Explicitly set collection name
    strict: true
});

// Add pre-save middleware for logging
userSchema.pre('save', function(next) {
    console.log('Pre-save hook - Saving user:', {
        username: this.username,
        _id: this._id
    });
    next();
});

// Create the model
const User = mongoose.model('User', userSchema);

// Ensure indexes are created properly
async function createIndexes() {
    try {
        await User.collection.dropIndexes();
        console.log('Dropped all indexes');
        
        await User.collection.createIndex(
            { username: 1 },
            { 
                unique: true,
                background: true,
                name: 'username_unique'
            }
        );
        console.log('Created username index');
    } catch (error) {
        console.error('Error managing indexes:', error);
    }
}

// Execute index creation
createIndexes();

module.exports = User;
