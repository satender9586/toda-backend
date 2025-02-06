const mongoose = require("mongoose")

const binNoteSchema = mongoose.Schema({
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
      deletedAt:{
        type:Date, 
        default:Date.now()
      },
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"note"
      },
      originalNoteId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
      },
      isPermanetDelete:{
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
},{timestamps:true})

binNoteSchema.index({ deletedAt: 1 }, { expireAfterSeconds: 5 * 24 * 60 * 60 });
const Bin = mongoose.model("BinNote", binNoteSchema);
module.exports = Bin