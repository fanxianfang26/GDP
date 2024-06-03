const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const config = require('./config/db');
const session = require('express-session');
const User = require('./models/User'); // 假设我们有一个User模型

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// 配置会话中间件
app.use(session({
  secret: 'XH8f2hNk9xPq5jR7gD3mA1uZ6yW4eE8c',
  resave: false,
  saveUninitialized: true
}));

const userRouter = require('./routes/user');
app.use('/api/users', userRouter);

const reportRoutes = require('./routes/report');
app.use('/api/reports', reportRoutes);

const iconSettingsRouter = require('./routes/icon-settings');
app.use('/api/icon-settings', iconSettingsRouter);

const apiRouter = require('./routes/api');
app.use('/api', apiRouter);

const authRouter = require('./routes/auth');
app.use('/api/auth', authRouter);

app.use(express.static('public'));

mongoose.connect(config.url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('数据库连接成功'))
  .catch(err => console.error('数据库连接失败', err));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'views')));

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

// 确保用户已登录，并且有权限访问/reportAdmin页面
app.use('/reportAdmin', (req, res, next) => {
  if (req.session && req.session.user && req.session.user.configPermission) {
    next();
  } else {
    res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
});

app.get('/reportAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'reportAdmin.html'));
});

// 确保用户已登录，并且有权限访问/userAdmin页面
app.use('/userAdmin', (req, res, next) => {
  if (req.session && req.session.user && (req.session.user.username === 'admin' || req.session.user.username === '167788')) {
    next();
  } else {
    res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
  }
});

app.get('/userAdmin', (req, res) => {
  res.sendFile(path.join(__dirname, 'views', 'userAdmin.html'));
});

// 检查用户登录状态和权限
app.get('/api/auth/checkLogin', (req, res) => {
  if (req.session && req.session.user) {
    res.json({
      isLoggedIn: true,
      username: req.session.user.username,
      configPermission: req.session.user.configPermission
    });
  } else {
    res.status(401).json({
      isLoggedIn: false,
      message: 'Unauthorized'
    });
  }
});

// 登录请求处理
app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (user && user.validatePassword(password)) {
      req.session.user = {
        username: user.username,
        configPermission: user.configPermission
      };
      res.json({
        message: '登录成功',
        configPermission: user.configPermission
      });
    } else {
      res.status(401).json({
        message: '用户名或密码错误'
      });
    }
  } catch (err) {
    res.status(500).json({
      message: '服务器错误'
    });
  }
});

app.use((req, res, next) => {
  next();
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('服务器出错了!');
});

const hostname = '0.0.0.0';
const port = 3000;
app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
