const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../models/User');

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: '用户名不存在' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: '密码错误' });
    }

    req.session.user = {
      id: user._id,
      username: user.username,
      configPermission: user.configPermission
    };

    // 登录成功后返回用户信息
    res.json({ configPermission: user.configPermission });
  } catch (error) {
    console.error('登录失败:', error);
    res.status(500).json({ message: '服务器错误' });
  }
});

router.get('/check', (req, res) => {
  if (req.session && req.session.user) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;