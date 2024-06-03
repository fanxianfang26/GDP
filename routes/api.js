const express = require('express');
const router = express.Router();
const upload = require('../upload'); // 引入上传中间件

router.post('/upload', upload.single('icon'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('没有上传文件');
  }
  
  const fileUrl = `/icons/${req.file.filename}`;
  res.send({ url: fileUrl });
});

module.exports = router;