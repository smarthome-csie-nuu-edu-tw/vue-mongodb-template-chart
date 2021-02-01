import mongoose from "mongoose";
const ObjectId = mongoose.Types.ObjectId;

import router from "./main.js";
import { ADMIN_PERMISSION } from "./main.js";

router.patch('/member/permission', async (req, res) => {
  const { memberId, groupId, adminId, permission } = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User');

  const g = await Group.findById(ObjectId(groupId)).exec();

  const memberAdmin = g.findMemberUser(adminId);
  if (!memberAdmin)
    throw new Error(`[Admin: ${adminId}] is not a member of group.`);
  if (memberAdmin.permission > ADMIN_PERMISSION)
    throw new Error(`[Admin: ${adminId}] is not a admin.`);

  if (memberAdmin >= permission)
    throw new Error('Permission error.');

  const member = g.members.find(p => p._id.toString() == memberId);

  member.permission = permission;

  await g.save();
  await g.populate('members.user').execPopulate();

  res.send({
    success: true,
    members: g.members
  });
});

router.delete('/member/remove', async (req, res) => {
  const { memberId, groupId, adminId } = req.body;

  const Group = mongoose.model('Group'),
    User = mongoose.model('User');

  const g = await Group.findById(ObjectId(groupId)).exec();

  const memberAdmin = g.findMemberUser(adminId);
  if (!memberAdmin)
    throw new Error(`[Admin: ${adminId}] is not a member of group.`);
  if (memberAdmin.permission > ADMIN_PERMISSION)
    throw new Error(`[Admin: ${adminId}] is not a admin.`);

  const idx = g.members.findIndex(p => p._id.toString() == memberId);
  const member = g.members[idx];

  const user = await User.findByIdAndUpdate(ObjectId(member.user), {
    $pull: { groups: ObjectId(groupId) }
  }).exec();

  g.members.splice(idx, 1);

  await g.save();
  await g.populate('members.user').execPopulate();

  res.send({
    success: true,
    members: g.members
  });
});