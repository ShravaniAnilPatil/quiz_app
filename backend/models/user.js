const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  quizzesAttempted: [
    {
      type: Schema.Types.ObjectId,
      ref: 'quiz_attempt'
    }
  ]
});

const User = mongoose.model('User', userSchema);

module.exports = User;
