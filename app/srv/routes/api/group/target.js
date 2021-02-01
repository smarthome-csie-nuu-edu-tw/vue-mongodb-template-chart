import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import router from "./main.js";

import { ADMIN_PERMISSION } from "./main.js";

router.post('/target/create', async (req, res) => {
  const { userId, groupId, name, score } = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User');

  const user = await User.findById(ObjectId(userId)).exec();

  const g = await Group.findById(ObjectId(groupId))
    .populate('members.user')
    .exec();

  if (g.targets.find(p => p.name == name)) {
    res.send({
      error: true,
      message: 'Name of target is already exist.'
    });
    return;
  }

  const memberUser = g.findMemberUser(userId);
  if (!memberUser)
    throw new Error(`[User: ${userId}] is not a member of group.`);

  const Target = mongoose.model('GroupTarget');

  const target = new Target({
    name,
    score: score,
    creator: ObjectId(userId),
    group: ObjectId(groupId)
  });

  await target.save();

  if (memberUser.permission <= ADMIN_PERMISSION) {
    g.targets.push(target._id);
    await g.save();
    await g.populate('targets').execPopulate();
    res.send({
      success: true,
      targets: g.targets
    });
  }
  else {
    g.pendingTargetList.push(target._id);
    await g.save();
    await g.populate('pendingTargetList').execPopulate();
    res.send({
      success: true,
      pendingTargetList: g.pendingTargetList
    });
  }
});

router.post('/target/submit', async (req, res) => {
  const { userId, groupId, targetId } = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    Target = mongoose.model('GroupTarget');

  const user = await User.findById(ObjectId(userId)).exec();
  const g = await Group.findById(ObjectId(groupId)).exec();
  const target = await Target.findById(ObjectId(targetId)).exec();

  if (!user || !g || !target)
    throw new Error('[Error: submit target] user, group or target is not exist.');

  g.targetFinishedList.push({
    member: user._id,
    target: target._id
  });

  await g.save();
  await g
    .populate('targetFinishedList.member')
    .populate('targetFinishedList.target')
    .execPopulate();

  res.send({
    success: true,
    targetFinishedList: g.targetFinishedList
  });
});

router.delete('/target/unsubmit', async (req, res) => {
  const { adminId, groupId, unsubmitId } = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User');

  const g = await Group.findById(ObjectId(groupId)).exec();

  const memberAdmin = g.findMemberUser(adminId);
  if (!memberAdmin)
    throw new Error(`[Admin: ${adminId}] is not a member of group.`);
  if (memberAdmin.permission > ADMIN_PERMISSION && memberAdmin.user._id.toString() != adminId)
    throw new Error(`[Admin: ${adminId}] is not a admin or member who submit this target.`);

  const idx = g.targetFinishedList.findIndex(p => p._id.toString() == unsubmitId);
  g.targetFinishedList.splice(idx, 1);

  await g.save();
  await g
    .populate('targetFinishedList.member')
    .populate('targetFinishedList.target')
    .execPopulate();

  res.send({
    success: true,
    targetFinishedList: g.targetFinishedList
  });
});

router.patch('/target/finish', async (req, res) => {
  const { adminId, groupId, finishId } = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    Target = mongoose.model('GroupTarget');

  const g = await Group.findById(ObjectId(groupId)).exec();

  const memberAdmin = g.findMemberUser(adminId);
  if (!memberAdmin)
    throw new Error(`[Admin: ${adminId}] is not a member of group.`);
  if (memberAdmin.permission > ADMIN_PERMISSION)
    throw new Error(`[Admin: ${adminId}] is not a admin.`);

  const finish = g.targetFinishedList.find(p => p._id.toString() == finishId);
  finish.passed = true;

  await g.populate('targetFinishedList.target')
    .execPopulate();

  const user = await User.findOneAndUpdate({
    _id: ObjectId(finish.member),
    'groupScores.group': ObjectId(groupId)
  }, {
    $inc: { 'groupScores.$.score': finish.target.score }
  }).exec();

  await Target.findByIdAndUpdate(finish.target._id, {
    $inc: { 'finished': 1 }
  }).exec();

  await g.save();
  await g
    .populate('targets')
    .populate('targetFinishedList.member')
    .populate('targetFinishedList.target')
    .populate('members.user')
    .execPopulate();

  res.send({
    success: true,
    targetFinishedList: g.targetFinishedList,
    members: g.members,
    targets: g.targets
  });
});

router.delete('/target/delete', async (req, res) => {
  const { adminId, groupId, targetId } = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User'),
    Target = mongoose.model('GroupTarget');

  const g = await Group.findById(ObjectId(groupId)).exec();

  const memberAdmin = g.findMemberUser(adminId);
  if (!memberAdmin)
    throw new Error(`[Admin: ${adminId}] is not a member of group.`);
  if (memberAdmin.permission > ADMIN_PERMISSION)
    throw new Error(`[Admin: ${adminId}] is not a admin.`);

  const idx = g.targets.findIndex(p => p.toString() == targetId);
  g.targets.splice(idx, 1);

  g.targetFinishedList = g.targetFinishedList.filter(p => p.target.toString() != targetId);

  await Target.findByIdAndDelete(ObjectId(targetId)).exec();
  await g.save();
  await g
    .populate('targets')
    .populate('targetFinishedList.member')
    .populate('targetFinishedList.target')
    .execPopulate();

  res.send({
    success: true,
    targetFinishedList: g.targetFinishedList,
    targets: g.targets
  });
});

router.post('/target/search', async (req, res) => {
  const { groupId, username, targetName } = req.body;

  const Group = mongoose.model('Group');

  const g = await Group.findById(ObjectId(groupId))
    .select('targetFinishedList')
    .populate('targetFinishedList.member')
    .populate('targetFinishedList.target')
    .exec();
  
  const newList = g.targetFinishedList.filter(p => {
    if (!p.passed)
      return true;
    if (username && !p.member.username.includes(username))
      return false;
    if (targetName && !p.target.name.includes(targetName))
      return false;
    return true;
  });

  res.send({
    success: true,
    targetFinishedList: newList
  });
});