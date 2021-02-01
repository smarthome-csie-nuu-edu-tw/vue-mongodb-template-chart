import express from "express";
import mongoose from "mongoose";

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, nickname } = req.body;

  const User = mongoose.model('User');
  const find = await User.findOne({ username }).exec();
  if (find) {
    res.send({
      error: true,
      message: 'username-duplicate'
    });
    return;
  }

  const user = new User({ username, password, nickname });

  await user.save();
  res.send({
    success: true
  });
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!/^[a-zA-Z0-9_]+$/.test(password))
    throw new Error('Password must match: /^[a-zA-Z0-9_]+$/');

  const User = mongoose.model('User');

  const user = await User.findOne({ username }).exec();
  if (!user) {
    res.send({
      error: true,
      type: 'username-not-found'
    });
    return;
  }
  if (await user.validatePassword(password)) {
    await user
      .populate('groups', 'name introduction')
      .execPopulate();

    delete user.password;
    res.send({
      success: true,
      user
    });
  }
  else {
    res.send({
      error: true,
      type: 'wrong-password'
    });
  }
});

export default router;
