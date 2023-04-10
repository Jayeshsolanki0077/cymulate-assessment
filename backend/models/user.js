const mongoose = require('mongoose');

const emailSchema = mongoose.Schema ({ 
    emailAddress: String,
    content: String,
    phishingStatus: String,
})

const User = mongoose.model('User', emailSchema);
module.exports = User;