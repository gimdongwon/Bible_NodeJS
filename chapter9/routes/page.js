const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = null;
  res.locals.followerCount = 0;
  res.locals.followingCount = 0;
  res.locals.followIdList = [];
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: '내 정보 - NodeBird' });
});

router.get('/join', (req, res, next) => {
  res.render('join', { title: '회원가입 - NodeBird' });
});

router.get('/', (req, res, next) => {
  const twist = [];
  res.render('main', {
    title: 'NodeBird',
    twist,
  });
});

module.exports = router;
