const mongoose = require('mongoose');
const validator = require('validator');


const emailSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  email: {
    type: String,
    required: [true, 'email required'],
    trim: true,
    validate: [validator.isEmail, 'invalid email'],
  },
  content: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'scheduled',
    enum: ['sent', 'scheduled', 'failed'],
  },
  scheduledAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
  jobId: {
    type: String,
  },
});


module.exports = emailSchema;
