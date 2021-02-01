import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Target = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32
  },
  score: {
    type: Number,
    required: true,
    min: [0, 'score must be 0~999'],
    max: [999, 'score must be 0~999']
  },
  creator: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  group: {
    type: ObjectId,
    ref: 'Group',
    required: true
  },
  finished: {
    type: Number,
    default: 0
  }
}, {
  collection: 'GroupTargets'
});

export default Target;