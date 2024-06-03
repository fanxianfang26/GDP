const express = require('express');
const router = express.Router();
const IconSettings = require('../models/IconSettings');

// 获取图标设置
router.get('/', async (req, res) => {
  try {
    const settings = await IconSettings.findOne();
    if (settings) {
      res.json(settings);
    } else {
      res.json({ rows: 10, columns: 4 }); // 默认设置
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器错误');
  }
});

// 更新图标设置
router.put('/', async (req, res) => {
  try {
    const { rows, columns } = req.body;
    let settings = await IconSettings.findOne();
    if (settings) {
      settings.rows = rows;
      settings.columns = columns;
      await settings.save();
    } else {
      settings = new IconSettings({ rows, columns });
      await settings.save();
    }
    res.json(settings);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器错误');
  }
});

module.exports = router;