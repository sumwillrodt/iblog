//set up the main homepage route
const router = require('express').Router();
const sequelize = require('../config/connection');

//import models
const { Post, User, Comment } = require('../models');

//return(GET) all existing posts
router.get('/', (req, res) => {
  Post.findAll({
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at'
    ],
    include: [
      {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
          model: User,
          attributes: ['username']
        }
      },
      {
        model: User,
        attributes: ['username']
      }
    ]
  })
    .then(dbPosts => {
      //pass a single post object into homepage template
      //console.log(dbPosts[0])
      const posts = dbPosts.map(post => post.get({ plain: true }));
      res.render('homepage', { posts });
    })
    .catch(err => {
      //return server error
      console.log(err);
      res.status(500).json(err);
    });
});

//Login
router.get('/login', (req, res) => {
  res.render('login');
});

// router.get('/', (req, res) => {
//   res.render('homepage');
//   id: 1,
//     post_url: 'https://handlebarsjs.com/guide/',
//     title: 'Handlebars Docs',
//     created_at: new Date(),
//     comments: [{}, {}],
//     user: {
//       username: 'test_user'
//     }
// });

module.exports = router; 