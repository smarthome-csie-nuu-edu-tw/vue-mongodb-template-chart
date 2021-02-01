import express from "express";
import mongoose from "mongoose";

const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

const ADMIN_PERMISSION = 3;

router.post('/create', async (req, res) => {
  const body = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User');

  const user = await User.findById(ObjectId(body.userId)).exec();
  if (!user)
    throw new Error(`[Founder: ${body.userId}] of group not exist in [Model: User].`);

  const g = new Group({
    name: body.name,
    introduction: body.introduction,
    founder: ObjectId(body.userId),
    members: [{
      user: ObjectId(body.userId),
      permission: 0
    }]
  });
  // create group
  await g.save();

  // update group of user
  user.groups.push(g._id);
  user.groupScores.push({ group: g._id });
  await user.save();

  await user
    .populate('groups', 'name introduction')
    .execPopulate();

  res.send({
    success: true,
    groups: user.groups
  });

  console.log('create group: ', body.name);
});

router.get('/data/:id', async (req, res) => {
  const Group = mongoose.model('Group');

  const g = await Group.findById(ObjectId(req.params.id)).exec();
  if (!g)
    throw new Error(`[group: ${req.params.id}] is not exist.`);

  await g
    .populate('members.user')
    .populate('targets')
    .populate('pendingTargets')
    .populate('targetFinishedList.member')
    .populate('targetFinishedList.target')
    .populate('applicants.user')
    .execPopulate();

  res.send({
    success: true,
    group: g
  });
});

router.post('/apply-to-join', async (req, res) => {
  const body = req.body;
  const { userId, groupId, reason } = body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User');

  const user = await User.findById(ObjectId(userId)).exec();

  const g = await Group.findById(ObjectId(groupId)).exec();
  g.applicants.push({
    user: user._id,
    reason
  });

  await g.save();
  await g.populate('applicants.user').execPopulate();
  res.send({
    success: true,
    applicants: g.applicants
  });
});

router.post('/join', async (req, res) => {
  const { userId, groupId, adminId } = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User');

  const admin = await User.findById(ObjectId(adminId)).exec();

  const g = await Group
    .findById(ObjectId(groupId))
    .populate('applicants.user')
    .exec();

  const memberAdmin = g.findMemberUser(adminId);
  if (!memberAdmin)
    throw new Error(`[Admin: ${adminId}] is not a member of group.`);
  if (memberAdmin.permission > ADMIN_PERMISSION)
    throw new Error(`[Admin: ${adminId}] is not a admin.`);

  const idx = g.applicants.findIndex(p => p.user._id == userId);
  g.applicants.splice(idx, 1);
  g.members.push({ user: ObjectId(userId) });

  await g.save();

  const user = await User.findByIdAndUpdate(ObjectId(userId), {
    $addToSet: {
      group: g._id,
      groupScores: { group: g._id }
    }
  }).exec();

  await g.populate('members.user').execPopulate();

  res.send({
    success: true,
    members: g.members,
    applicants: g.applicants
  });
});

export default router;
export { ADMIN_PERMISSION };