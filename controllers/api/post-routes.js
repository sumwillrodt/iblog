const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Comment } = require('../../models');
const withAuth = require('../../utils/auth');

//GET all users
router.get('/', (req, res) => {
  console.log('======================');
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
    .then(dbPosts => res.json(dbPosts))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//GET single post
router.get('/:id', (req, res) => {
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
      res.json(dbPosts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//CREATE post
router.post('/', withAuth, (req, res) => {
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.session.user_id
  })
    .then(dbPosts => res.json(dbPosts))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//UPDATE post
router.put('/:id', withAuth, (req, res) => {
  Post.update(
    {
      title: req.body.title
    },
    {
      where: {
        id: req.params.id
      }
    }
  )
    .then(dbPosts => {
      if (!dbPosts) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPosts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//DELETE post
router.delete('/:id', withAuth, (req, res) => {
  console.log('id', req.params.id);
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPosts => {
      if (!dbPosts) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPosts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;
