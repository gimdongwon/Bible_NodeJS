const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User, Hashtag } = require("../models");

const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user
    ? req.user.Followings.map((f) => f.id)
    : [];
  res.locals.following = req.user && req.user.Followings.map((f) => f.nick); // 팔로잉 목록
  res.locals.followering = req.user && req.user.Followers.map((f) => f.nick);
  next();
});

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - NodeBird" });
});

router.get("/join", isNotLoggedIn, (req, res, next) => {
  res.render("join", { title: "회원가입 - NodeBird" });
});

// router.get('/', (req, res, next) => {
//   const twist = [];
//   res.render('main', {
//     title: 'NodeBird',
//     twist,
//   });
// });

router.get("/", async (req, res, next) => {
  try {
    const posts = await Post.findAll({
      include: {
        model: User,
        attributes: ["id", "nick"],
      },
      order: [["createdAt", "DESC"]],
    });
    res.render("main", {
      title: "NodeBird",
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.get("/hashtag", async (req, res, next) => {
  const query = req.query.hashtag;
  if (!query) {
    return res.redirect("/");
  }
  try {
    const hashtag = await Hashtag.findOne({ where: { title: query } });
    let posts = [];
    if (hashtag) {
      posts = await hashtag.getPosts({ include: [{ model: User }] });
    }
    return res.render("main", {
      title: `${query} | NodeBird`,
      twits: posts,
    });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

module.exports = router;
