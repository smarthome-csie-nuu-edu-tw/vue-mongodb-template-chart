import mongoose from "mongoose";

import schema_user from "./schema/User.js";
import schema_group from "./schema/Group.js";
import schema_group_target from "./schema/Group/Target.js";

export default async function() {
  await mongoose.connect('mongodb://mongodb:27017/do_score', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  });

  // models
  const User = mongoose.model('User', schema_user);
  await User.createCollection();

  const Group = mongoose.model('Group', schema_group);
  await Group.createCollection();

  // update change of schema
  const gs = await Group.find().exec();
  gs.forEach(p => p.save());

  const GroupTarget = mongoose.model('GroupTarget', schema_group_target);
  await GroupTarget.createCollection();

  console.info('--- mongoose init finished.');
};