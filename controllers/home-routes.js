//set up the main homepage route
const router = require('express').Router();
const sequelize = require('../config/connection');

//import models
const { Post, User, Comment } = require('../models');

//return(GET) all existing posts
router.get('/', (req, res) => {
  console.log('====================');
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
      res.render('homepage', { 
        posts,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      //return server error
      console.log(err);
      res.status(500).json(err);
    });
});

//GET single post
router.get('/post/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
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
      if (!dbPosts) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }

      // serialize the data
      const post = dbPosts.get({ plain: true });

      // pass data to template
      res.render('single-post', { 
        post,
        loggedIn: req.session.loggedIn
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Login
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }
  res.render('login');
});

// router.get('/', (req, res) => {
//   console.log(req.session);

// });


//test
router.get('/post/:id', (req, res) => {
  const post = {
    id: 1,
    post_url: 'https://handlebarsjs.com/guide/',
    title: 'Handlebars Docs',
    created_at: new Date(),
    vote_count: 10,
    comments: [
      {
        comment_text: 'sdfdfdsf',
        post_id: 1,
      }, {}],
    user: {
      username: 'test_user'
    }
  };

  res.render('single-post', { post });
});


module.exports = router; 