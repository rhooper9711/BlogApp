var express = require('express');
var router = express.Router();

var monk = require('monk');
var db = monk('localhost:27017/blogPosts');

router.get('/', function (req, res) {
    var collection = db.get('blogPosts');
    collection.find({}, function (err, blogPosts) {
        if (err) throw err;
        res.json(blogPosts);
    });
});

router.delete('/:id', function (req, res) {
    var collection = db.get('blogPosts');
    collection.remove({ _id: req.params.id }, function (err, blogPosts) {
        if (err) throw err;

        res.json(blogPosts);
    });
});

module.exports = router;