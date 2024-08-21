const mongoose = require('mongoose');

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  levelOfApproval: {
    type: Number,
    required: true
  },
  approvers: [
    {
      employee_id: {
        type: String,
        required: true
      },
      name: {
        type: String,
        required: true
      },
      email_id: {
        type: String,
        required: true
      }
    }
  ],
  reminder_days: {
    type: Number
  },
  emailTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MailTemplate',
    required: true
  },
  remainderEmailTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MailTemplate',
    required: true
  },
  responseEmailTemplate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MailTemplate',
    required: true
  },
  tableRows: [
    {
      fieldName: {
        type: String,
        required: true
      },
      fieldType: {
        type: String,
        required: true
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model('Template', templateSchema);