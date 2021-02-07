const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true},
  userScore: Number
 
});

const Score = mongoose.model('Score', schema);

module.exports = Score;