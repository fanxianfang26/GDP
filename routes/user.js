const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// 获取所有用户
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!');
  }
});

// 获取单个用户详情
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send('用户不存在');
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!');
  }
});


// 创建新用户
router.post('/', async (req, res) => {
  try {
    const { username, password, name, department, company, configPermission } = req.body;
    const user = new User({ username, password, name, department, company, configPermission });
    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!');
  }
});

// 更新用户信息
router.put('/:id', async (req, res) => {
  try {
    const { password, ...updateData } = req.body;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }
    const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!');
  }
});

// 删除用户
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!');
  }
});

module.exports = router;
