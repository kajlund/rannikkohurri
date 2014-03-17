(function (angular) {
    'use strict';

    var app = angular.module('app', [
        // Angular modules
        'ngRoute'   // routing
    ]);

    // Configure Routes
    app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                redirectTo: '/home'
            }).when('/home', {
                templateUrl: 'app/home.html',
                controller: 'MainController'
            }).when('/posts', {
                templateUrl: 'app/posts/posts.html',
                controller: 'PostsController'
            }).when('/links', {
                templateUrl: 'app/links/links.html',
                controller: 'LinksController'
            }).when('/about', {
                templateUrl: 'app/about.html',
                controller: 'AboutController'
            }).when('/books', {
                templateUrl: 'app/books/books.html',
                controller: 'BooksController'
            }).when('/movies', {
                templateUrl: 'app/movies/movies.html',
                controller: 'MoviesController'
            })
            .otherwise({ redirectTo: '/home' });
    }]);

    app.run(['$rootScope', '$location',
        function($rootScope, $location) {
            console.log('App Loaded');
        }]);

}(angular));
(function (angular) {
    'use strict';

    angular.module('app').controller('AboutController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));
(function (angular) {
    'use strict';

    angular.module('app').controller('MainController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

            $scope.getClass = function(path) {
                if ($location.path().substr(0, path.length) == path) {
                    return "active"
                } else {
                    return ""
                }
            }
        }]);
}(angular));
(function (angular) {
    'use strict';

    angular.module('app').controller('BooksController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));
(function (angular) {
    'use strict';

    angular.module('app').controller('LinksController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));
(function (angular) {
    'use strict';

    angular.module('app').controller('PostsController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));
(function (angular) {
    'use strict';

    angular.module('app').controller('MoviesController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));