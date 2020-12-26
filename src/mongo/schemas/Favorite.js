const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Favorite = mongoose.model('Favorite', schema);

module.exports = Favorite;