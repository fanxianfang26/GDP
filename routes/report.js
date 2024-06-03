const express = require('express');
const router = express.Router();
const Report = require('../models/report');
const mongoose = require('mongoose');

// 获取报表列表
router.get('/', async (req, res) => {
  try {
    const reports = await Report.find().sort('order');
    //console.log('报表列表:', reports); // 添加调试代码
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!'); 
  }
});

// 获取单个报表详情
router.get('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).send('无效的报表ID');
    }
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).send('报表不存在');
    }
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!');
  }
});

// 添加新报表
router.post('/', async (req, res) => {
  try {
    const report = new Report(req.body);
    await report.save();
    res.json(report); 
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!');
  } 
});

// 更新报表信息
router.put('/:id', async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, { new: true });  
    res.json(report);
  } catch (err) { 
    console.error(err);
    res.status(500).send('服务器出错了!');  
  }
});

// 删除报表
router.delete('/:id', async (req, res) => {
  try {
    const reportId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(reportId)) {
      return res.status(400).send('无效的报表ID');
    }
    await Report.findByIdAndDelete(reportId);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).send('服务器出错了!');
  }
});

module.exports = router;