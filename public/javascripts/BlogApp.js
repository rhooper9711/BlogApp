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

    app.controller('BlogController', ['$scope', '$resource', '$routeParams', '$location', '$route',
    function ($scope, $resource, $routeParams, $location, $route) {
       var Blogs = $resource('/api/blogs/:id', null, {
           'update': { method:'PUT' 
        }});
        Blogs.get({ id: $routeParams.id }, function (blogs) {
            $scope.blogs = blogs;
        })
        $scope.add = function () {
            Blogs.save({ id: $routeParams.id }, $scope.posts, function (blogs) {
                $location.path('/blogs/'+$routeParams.id);
                $route.reload();
            });
        }

        $scope.averageRating = function () {
            console.log($scope.blogs.rating)
            var ratingArray = $scope.blogs.rating;
            var totalRating = 0;
            for (var i = 0; i < ratingArray.length; i++) {
                totalRating = totalRating + ratingArray[i];
            }
            console.log("after adding the new rating " + totalRating)
            if (totalRating != 0) {
                var averageRating = totalRating / $scope.blogs.ratingCount;
                console.log("count " + $scope.blogs.ratingCount);
            } else {
                averageRating = 0
            }
            $scope.averageRating.averageRating = averageRating;
            return averageRating;
        }

        $scope.saveRating = function () {
           // Blogs.update({ id: $routeParams.id }, $scope.rating, $scope.averageRating.averageRating, function (blogs) {
            Blogs.update({ id: $routeParams.id }, $scope.rating, function (blogs) {
                $location.path('/blogs/'+$routeParams.id);
                $route.reload();
        })
        }

    }]);

app.controller('DeletePostCtrl', ['$scope', '$resource', '$routeParams', '$location',
    function ($scope, $resource, $routeParams, $location) {
        var Blogs = $resource('/api/blogs/:id/:postid');
        Blogs.get({ id: $routeParams.id, postid: $routeParams.postid}, function (blogs) {
         $scope.blogs = blogs;
        })
        $scope.deletePost = function () { console.log("hello");
            Blogs.delete({ id: $routeParams.id, postid: $routeParams.postid }, function (blogs) {
                $location.path('/blogs/'+$routeParams.id);
            });
        };
    }]);
