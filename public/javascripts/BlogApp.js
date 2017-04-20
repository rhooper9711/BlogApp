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
            controller: 'DeleteBlogCtrl'
        })
        .when('/ViewBlogs', {
            templateUrl: 'partials/ViewBlogs.html',
            controller: 'BlogController'
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






