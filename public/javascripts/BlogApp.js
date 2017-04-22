

var app = angular.module('blogApp', ['ngResource', 'ngRoute']);

app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/Home.html',
            controller: 'HomeCtrl'
        })
        .when('/add-blog', {
            templateUrl: 'partials/blog-form.html',
            controller: 'AddBlogCtrl'
        })
        .when('/blogs/delete/:id', {
            templateUrl: 'partials/blog-delete.html',
            controller: 'DeleteBlogsCtrl'
        })
        .when('/blogs/:id', {
            templateUrl: 'partials/ViewBlogs.html',
            controller: 'BlogController'
        })
        .when('/blogs/delete/:id/:postid', {
            templateUrl: 'partials/post-delete.html',
            controller: 'DeletePostCtrl'
        })
        .otherwise({
            redirectTo: '/'
        });
}]);

app.controller('HomeCtrl', ['$scope', '$resource',
    function ($scope, $resource) {
        var Blogs = $resource('/api/blogs');
        Blogs.query(function (blogs) {
            $scope.blogs = blogs;
        });
    }]);


app.controller('AddBlogCtrl', ['$scope', '$resource', '$location',
    function ($scope, $resource, $location) {
        $scope.save = function () {
            var Blogs = $resource('/api/blogs');
            Blogs.save($scope.blogs, function () {
                $location.path('/');
            });
        };
    }]);


app.controller('DeleteBlogsCtrl', ['$scope', '$resource', '$location', '$routeParams',
    function ($scope, $resource, $location, $routeParams) {
        var Blogs = $resource('/api/blogs/:id');
        Blogs.get({ id: $routeParams.id }, function (blogs) {
            $scope.blogs = blogs;
        })

        $scope.delete = function () {
            Blogs.delete({ id: $routeParams.id }, function (blogs) {
                $location.path('/');
            });
        }
    }]);

    app.controller('BlogController', ['$scope', '$resource', '$routeParams', '$location',
    function ($scope, $resource, $routeParams, $location) {
       var Blogs = $resource('/api/blogs/:id');
        Blogs.get({ id: $routeParams.id }, function (blogs) {
            $scope.blogs = blogs;
        })
        $scope.add = function () {
            Blogs.save({ id: $routeParams.id }, $scope.posts, function (blogs) {
                $location.path('/blogs/'+$routeParams.id);
            });
        }

        var rBlog = $resource('/api/blogs/:id/');
        var newRating = rBlog.rating + $scope.rating;
        var newCount = rBlog.ratingCount + 1;

        $scope.saveRating = function () {
            $scope.newAverage = newRating / newCount;
        }
    }]);

app.controller('DeletePostCtrl', ['$scope', '$resource', '$routeParams', '$location',
    function ($scope, $resource, $location, $routeParams) {
        var Blogs = $resource('/api/blogs/:id/:postid');
        Blogs.get({ id: $routeParams.id, postid: $routeParams.postid}, function (blogs) {
         $scope.blogs = blogs;
        })
        $scope.deletePost = function () {
            Blogs.delete({ id: $routeParams.id, postid: $routeParams.postid }, function (blogs) {
                $location.path('/blogs/'+$routeParams.id);
            });
        };
    }]);
