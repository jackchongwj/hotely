// models/ErrorLog.js

import mongoose from 'mongoose';

const errorLogSchema = new mongoose.Schema({
  statusCode: {
    type: Number,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },

});

const ErrorLog = mongoose.model('ErrorLog', errorLogSchema);

export default ErrorLog;
