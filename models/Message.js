const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  receiverName: {
    type: String,
    required: [true, 'Please add a receiver name'],
    unique: false,
    trim: true,
    minlength: [6, 'Receiver name can not be less than 6 characters'],
  },
  receiverEmail: {
    type: String,
    required: [true, 'Please add a receiver name'],
    unique: false,
    trim: true,
    minlength: [10, 'Receiver email can not be less than 10 characters'],
  },

  subject: {
    type: String,
    required: [true, 'Please add a subject'],
    unique: false,
    trim: true,
    minlength: [10, 'Subject can not be less than 10 characters'],
  },

  message: {
    type: String,
    required: [true, 'Please add a message'],
    unique: false,
    trim: true,
    minlength: [10, 'Message can not be less than 10 characters'],
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Message', MessageSchema);
