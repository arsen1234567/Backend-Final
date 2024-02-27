// models/actorModel.js
const mongoose = require('mongoose');

const actorSchema = new mongoose.Schema({
    name: {type: String, required: true},
    gender: {type: String, required: true},
    nationality: {type: String},
    net_worth: {type: Number},
    gender: {type: String, required: true},
    birthday: {type: String},
    occupation: {type: Array}
}, { timestamps: true });

const Actor = mongoose.model('Actor', actorSchema);

module.exports = Actor;
