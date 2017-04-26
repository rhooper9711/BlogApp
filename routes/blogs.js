var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/blogs');
var ObjectID = require('mongodb').ObjectID;

router.get('/', function (req, res) {
    var collection = db.get('blogs');
    collection.find({}, function (err, blogs) {
        if (err) throw err;
        res.json(blogs);
    });
});


router.get('/:id', function (req, res) {
    var collection = db.get('blogs');
    collection.findOne({ _id: req.params.id }, function (err, blogs) {
        if (err) throw err;

        res.json(blogs);
    });
});


router.delete('/:id', function (req, res) {
    var collection = db.get('blogs');
    collection.remove({ _id: req.params.id }, function (err, blogs) {
        if (err) throw err;

        res.json(blogs);
    });
});


router.post('/', function (req, res) {
    var collection = db.get('blogs');
    collection.insert({
        title: req.body.title,
        posts: [],
        author: req.body.author,
        rating: [],
        ratingCount: 0

    }, function (err, blogs) {
        if (err) throw err;

        res.json(blogs);
    });
});


router.post('/:id', function (req, res) {
    var collection = db.get('blogs');

    collection.findOneAndUpdate({ _id: req.params.id},
    {
        $push: { posts: {
        heading: req.body.heading,
        date: req.body.date,
        body: req.body.body,
        postid: 0
    }}},
         {
        $inc: { "posts.$.postid": 1}
        } , function (err, blogs) {
        if (err) throw err;
        res.json(blogs);
    });
});

router.put('/:id', function (req, res) {
    var collection = db.get('blogs');
    collection.findOneAndUpdate({ _id: req.params.id},
     {
        $inc: {ratingCount: 1},
        $push: { rating: parseInt(req.body.rating) }, 
        $set: { averageRating: parseFloat(req.body.averageRating) } 
    }, function (err, blogs) {
        if (err) throw err;

        res.json(blogs);
    });
});

router.get('/:id/:postid', function (req, res) {
    var collection = db.get('blogs');
    collection.findOne({ _id: req.params.id }, {"posts.$.postid": req.params.postid}, function (err, blogs) {
        if (err) throw err;

        res.json(blogs);
    });
});

router.delete('/:id/:postid', function (req, res) {
    var collection = db.get('blogs');
    collection.update({ _id: req.params.id},
    { $pull: {posts: {postid: req.params.postid }}},
     function (err, blogs) {
        if (err) throw err;

        res.json(blogs);
    }
    );
});


module.exports = router;

