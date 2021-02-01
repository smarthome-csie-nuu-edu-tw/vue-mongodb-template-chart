import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const Group = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 32
  },
  introduction: {
    type: String,
    maxlength: 200,
    default: ''
  },
  founder: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    user: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    permission: {
      type: Number,
      default: 10
    }
  }],
  targets: [{
    type: ObjectId,
    ref: 'GroupTarget'
  }],
  pendingTargetList: [{
    type: ObjectId,
    ref: 'GroupTarget'
  }],
  targetFinishedList: [{
    member: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
    target: {
      type: ObjectId,
      ref: 'GroupTarget',
      required: true
    },
    finishAt: {
      type: Date,
      default: Date.now
    },
    passed: {
      type: Boolean,
      default: false
    }
  }],
  applicants: [{
    user: {
      type: ObjectId,
      ref: 'User'
    },
    reason: {
      type: String,
      default: ''
    }
  }],
  options: {
    join: {
      type: Number,
      enum: [0, 1], // 0: 審核加入, 1: 自由加入
      default: 0
    }
  },
  createAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'Groups'
});

Group.methods.findMemberUser = function(userId) {
  return this.members.find(p => p.user._id.toString() == userId);
}

export default Group;