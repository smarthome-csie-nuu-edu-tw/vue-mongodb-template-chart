import mongoose from "mongoose";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const User = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 32,
    match: /^[a-zA-Z0-9_]+$/,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 4,
    maxlength: 64
  },
  nickname: {
    type: String,
    maxlength: 32,
    default() {
      return this.username;
    }
  },
  groups: [{
    type: ObjectId,
    ref: 'Group'
  }],
  groupScores: [{
    group: {
      type: ObjectId,
      ref: 'Group'
    },
    score: {
      type: Number,
      default: 0
    }
  }],
  createAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Users'
});

const SALT_WORK_FACTOR = 10;

User.pre('save', async function(next) {
  if (!this.isModified('password'))
    return next();
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    this.password = await bcrypt.hash(this.password, salt);
    return next();
  } catch (err) {
    return next(err);
  }
});

User.methods.validatePassword = async function(data) {
  return await bcrypt.compare(data, this.password);
};

export default User;