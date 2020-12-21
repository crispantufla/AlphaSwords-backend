const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    comment: String,
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

const Comments = mongoose.model('Comments', schema);

module.exports = Comments;