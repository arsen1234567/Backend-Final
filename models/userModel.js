const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const historyItemSchema = new Schema({
  type: {
    type: String,
    required: true,
    enum: ['Weather', 'Airport', 'Country'],
  },
  refId: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: 'history.type' 
  }
}, {_id: false}); 

const userSchema = new Schema({
    username: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true, minlength: 5},
    admin: {type: Boolean, default: false},
    history: [historyItemSchema]
}, {collection: 'final'});

const User = mongoose.model('User', userSchema);
module.exports = User;
