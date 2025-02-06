
const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  noteTitle: {
    type: String,
    require: true,
    min: 5,
    max: 50,
  },
  description: {
    type: String,
    require: true,
  },

  isPriority: {
    type: Boolean,
    default: false,
  },
  noteColor: {
    type: String,
    default:'gray'
  },
  isArchive:{
    type:Boolean,
    default:false,
  },
  isBin:{
    type:Boolean,
    default:false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Note = mongoose.model("Note", noteSchema);
module.exports = Note;
