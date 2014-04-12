var angular = angular || null,
    toastr = toastr || null,
    Spinner = Spinner || null,
    moment = moment || null;

(function (angular, toastr, Spinner, moment) {
    'use strict';

    // Spinner Configuration
    var spinnerOpts = {
        radius: 40,
        lines: 7,
        length: 0,
        width: 30,
        speed: 1.7,
        corners: 1,
        trail: 100,
        color: '#D00062',
        zIndex: 2e9,
        left: 'auto',
        top: '200px'
    };

    moment.lang('sv');

    // Configure Toastr
    toastr.options.timeOut = 2000;
    toastr.options.positionClass = 'toast-bottom-right';


    var app = angular.module('app', [
        // Angular modules
        'ngRoute',      // routing
        'ngCookies',    // cookies
        'ui.bootstrap', // ui-bootstrap library
        'hc.marked'     // markdown directive
    ]);

    // Configure Routes
    app.config(['$routeProvider', '$httpProvider', 'marked',
        function ($routeProvider, $httpProvider, marked) {
            $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1';
            $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L';
            marked.setOptions({gfm: true});

            $routeProvider
                .when('/', {
                    redirectTo: '/home'
                }).when('/home', {
                    templateUrl: 'app/home.html',
                    controller: 'MainController'
                }).when('/posts', {
                    templateUrl: 'app/posts/posts.html',
                    controller: 'PostsController'
                }).when('/posts/:id', {
                    templateUrl: 'app/posts/post.html',
                    controller: 'PostController'
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
                }).when('/events', {
                    templateUrl: 'app/events/list.html',
                    controller: 'EventListController'
                })
                .otherwise({ redirectTo: '/home' });
        }]);

    app.run(['$rootScope', '$location', '$log',
        function ($rootScope, $location, $log) {
            $rootScope.spinner = new Spinner(spinnerOpts).spin(window.document.documentElement);
            $rootScope.spinner.spin();
            $log.info('App Loaded');
        }]);

    app.directive('aDisabled', function ($compile) {
        return {
            restrict: 'A',
            priority: -99999,
            link: function (scope, element, attrs) {
                scope.$watch(attrs.aDisabled, function (val, oldval) {
                    if (!!val) {
                        element.unbind('click');
                    } else if (oldval) {
                        element.bind('click', function () {
                            scope.$apply(attrs.ngClick);
                        });
                    }
                });
            }
        };
    });

}(angular, toastr, Spinner, moment));
(function (angular) {
    'use strict';

    angular.module('app').controller('AboutController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));
(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('MainController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService) {

            $rootScope.spinnerOptions = {
                radius: 40,
                lines: 7,
                length: 0,
                width: 30,
                speed: 1.7,
                corners: 1,
                trail: 100,
                color: '#000',
                left: 'auto',
                top: 'auto'
            };
            $scope.session = SessionService;
            $log.info(SessionService);

            if (!SessionService.loggedOn()) {
                $log.info('not logged on');
                SessionService.autoSignon()
                    .then(function (data) {
                        $log.info($scope.session);
                    }, function (err) {
                        $log.error(err);
                    });
            }
            $rootScope.spinner.stop();

            $scope.getClass = function (path) {
                var className = "";

                if ($location.path().substr(0, path.length) === path) {
                    className = "active";
                }
                return className;
            };

            $scope.onSignonClick = function () {
                var user = { name: '', pwd: '' },
                    modalInstance = $modal.open({
                        templateUrl: 'app/signon.html',
                        controller: 'SignonController',
                        resolve: {
                            user: function () {
                                return user;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    SessionService.signon(user.name, user.pwd)
                        .then(function (result) {
                            toastr.info(SessionService.userObj.username + ' signed on');
                        }, function (error) {
                            toastr.error(error.error);
                        });
                }, function () {
                    toastr.info('Signon cancelled');
                });
            };

            $scope.onSignoffClick = function () {
                $log.info('Signing off');
                SessionService.signoff();
                toastr.warning('User signed off');
            };
        }]);
}(angular, toastr));
(function (angular) {
    'use strict';

    angular.module('app').controller('SignonController', ['$scope', '$modalInstance', 'user',
        function ($scope, $modalInstance, user) {
            $scope.user = user;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));
(function (angular) {
    'use strict';

    angular.module('app').factory('SessionService', ['$rootScope', '$http', '$cookieStore', '$log', '$q',
        function ($rootScope, $http, $cookieStore, $log, $q) {
            var res = {};
            res.sessionToken = '';
            res.userObj = null;

            function setSession(data) {
                res.userObj = data;
                res.sessionToken = data.sessionToken;
                $cookieStore.put('ParseUser', data);

            }
            function clearSession() {
                res.userObj = null;
                res.sessionToken = '';
                $cookieStore.remove('ParseUser');
            }

            res.autoSignon = function () {
                var user = $cookieStore.get('ParseUser'),
                    config = {
                        headers: {
                            'X-Parse-Application-Id': 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1',
                            'X-Parse-REST-API-Key': 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L',
                            'X-Parse-Session-Token': user ? user.sessionToken : ''
                        },
                        method: 'GET',
                        url: 'https://api.parse.com/1/users/me'
                    },
                    d = $q.defer();

                if (user && user.sessionToken.length > 10) {
                    $http(config)
                        .success(function(data, status, headers, config) {
                            $log.info('autoSignon success, data = %o', data);
                            setSession(data);
                            d.resolve(data);
                        })
                        .error(function(data, status, headers, config) {
                            d.reject(data.error);
                        });
                } else {
                    d.reject('Invalid Cookie');
                }
                return d.promise;
            };

            res.loggedOn = function () {
                return res.userObj !== null;
            };

            res.signoff = function () {
                clearSession();
            };

            res.signon = function (aUsr, aPwd) {
                var params = '?username=' + aUsr + '&password=' + aPwd,
                    config = {
                        method: 'GET',
                        url: ' https://api.parse.com/1/login' + params
                    };

                return $http(config)
                    .then(function (response) {
                        if (typeof response.data === 'object') {
                            setSession(response.data);
                            return response.data;
                        } else {
                            clearSession();
                            return $q.reject(response.data);
                        }
                    }, function (response) {
                        // something went wrong
                        clearSession();
                        return $q.reject(response.data);
                    });
            };

            return res;
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
    angular.module('app').controller('eventDeleteController', ['$scope', '$modalInstance', 'event',
        function ($scope, $modalInstance, event) {
            $scope.event = event;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));
(function (angular) {
    'use strict';
    angular.module('app').controller('eventEditController', ['$scope', '$modalInstance', 'event',
        function ($scope, $modalInstance, event, eventDate) {
            $scope.event = event;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));
var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('EventListController', ['$scope', '$rootScope', '$log', '$modal', 'EventDataService',
        function ($scope, $rootScope, $log, $modal, EventDataService) {

            function getEvents() {
                $rootScope.spinner.spin();
                EventDataService.getEvents()
                    .then(function (data) {
                        $log.info(data);
                        $scope.events = data.data.results;
                        $rootScope.spinner.stop();
                    }, function (data) {
                        $rootScope.spinner.stop();
                        $log.error(data);
                        toastr.error(data.error.code + ' ' + data.error.error);
                    });
            }

            getEvents();

            $scope.onAddClick = function () {
                var event = {
                        starts: '',
                        eventName: '',
                        placeName: '',
                        organizer: '',
                        organizerUrl: '',
                        smartum: false
                    },
                    modalInstance = $modal.open({
                        templateUrl: 'app/events/edit.html',
                        controller: 'eventEditController',
                        resolve: {
                            event: function () {
                                return event;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    EventDataService.updateItem(event)
                        .then(function (data) {
                            // data.createdAt data.objectId
                            $log.info('Added Event %o', data);
                            toastr.success('Event added');
                            getEvents();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancelled New');
                    toastr.warning('New cancelled');
                });
            };

            $scope.onEditClick = function (event) {
                var modalInstance = $modal.open({
                        templateUrl: 'app/events/edit.html',
                        controller: 'eventEditController',
                        resolve: {
                            event: function () {
                                return event;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    EventDataService.updateItem(event)
                        .then(function (data) {
                            // data.updatedAt
                            $log.info('Updated Event %o', data);
                            toastr.success('Event updated');
                            getEvents();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancelled Edit');
                    toastr.warning('Edit cancelled');
                });
            };

            $scope.onDeleteClick = function (event) {
                var modalInstance = $modal.open({
                        templateUrl: 'app/events/delete.html',
                        controller: 'eventDeleteController',
                        resolve: { event: function () { return event; } }
                    });

                modalInstance.result.then(function () {
                    EventDataService.deleteItem(event)
                        .then(function (data) {
                            $log.info('Deleted Event');
                            toastr.success('Event deleted');
                            getEvents();
                        }, function (data) {
                            $log.error(data);
                            toastr.error(data.error.code + ' ' + data.error.error);
                        });
                }, function () {
                    $log.info('Cancel');
                    toastr.warning('Delete cancelled');
                });
            };
        }]);
}(angular, toastr));
var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').factory('EventDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/Event',
                res = {};

            res.getEvent = function (aId) {
                var config = {
                        isArray: false,
                        method: 'GET',
                        url: baseUrl + '/' + aId
                    };
                return $http(config);
            };

            res.getEvents = function () {
                var config = {
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?count=1&limit=1000&order=starts'
                };
                return $http(config);
            };

            res.updateItem = function (obj) {
                var isNew = obj.objectId === undefined,
                    url = isNew ? baseUrl + '/' : baseUrl + '/' + obj.objectId,
                    config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        method: isNew ? 'POST' : 'PUT',
                        url: url,
                        data: obj
                    };

                return $http(config);
            };

            res.deleteItem = function (obj) {
                var url = baseUrl + '/' + obj.objectId,
                    config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        method: 'DELETE',
                        url: url
                    };

                return $http(config);
            };

            return res;
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

    angular.module('app').controller('MoviesController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));
(function (angular, marked) {
    'use strict';

    angular.module('app').controller('PostController', ['$scope', '$rootScope', '$routeParams', '$http', '$sce', '$log', 'PostDataService',
        function ($scope, $rootScope, $routeParams, $http, $sce, $log, PostDataService) {
            $rootScope.spinner.spin();

            function renderData(aPost) {
                $http.get('/dropbox/' + aPost.get('slug'))
                    .then(function (data) {
                        $scope.markdown = $sce.trustAsHtml(marked(data.data));
                        $rootScope.spinner.stop();
                    });
            }

            if ($routeParams.id) {
                PostDataService.getPost($routeParams.id)
                    .then(function (data) {
                        $scope.title = data.get('title');
                        renderData(data);
                    });
            }
        }]);
}(angular, marked));
(function (angular) {
    'use strict';
    angular.module('app').controller('postDeleteController', ['$scope', '$modalInstance', 'post',
        function ($scope, $modalInstance, post) {
            $scope.post = post;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));
(function (angular) {
    'use strict';
    angular.module('app').controller('postEditController', ['$scope', '$modalInstance', 'post',
        function ($scope, $modalInstance, post) {
            $scope.post = post;

            $scope.ok = function () {
                $modalInstance.close('OK');
            };

            $scope.cancel = function () {
                $modalInstance.dismiss('Cancel');
            };
        }]);
}(angular));
(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('PostsController', ['$scope', '$rootScope', '$log', '$modal', 'PostDataService',
        function ($scope, $rootScope, $log, $modal, PostDataService) {
            $rootScope.spinner.spin();

            PostDataService.getPosts()
                .then(function (data) {
                    $log.info(data);
                    $scope.posts = data;
                    $scope.$apply();
                    $rootScope.spinner.stop();
                });

            $scope.onAddClick = function () {
                var post = new PostDataService.PostModel(),
                    modalInstance = $modal.open({
                        templateUrl: 'app/posts/edit.html',
                        controller: 'postEditController',
                        resolve: {
                            post: function () {
                                return post;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    post.save(null, {
                        success: function (newPost) {
                            //refreshData($scope.currentPage);
                            toastr.success('Post added');
                        },
                        error: function (newPost, error) {
                            toastr.error(error.description);
                        }
                    });
                }, function () {
                    $log.info('Cancel');
                    toastr.warning('Edit cancelled');
                });
            };

            $scope.onEditClick = function (p) {
                var post = {
                        slug: p.get('slug'),
                        title: p.get('title'),
                        excerpt: p.get('excerpt'),
                        tags: p.get('tags'),
                        published: p.get('published'),
                        publishDate: p.get('publishDate')
                    },
                    modalInstance = $modal.open({
                        templateUrl: 'app/posts/edit.html',
                        controller: 'postEditController',
                        resolve: {
                            post: function () {
                                return post;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    post.save({
                        success: function (newPost) {
                            //refreshData($scope.currentPage);
                            toastr.success('Post updated');
                        },
                        error: function (newPost, error) {
                            toastr.error(error.description);
                        }
                    });
                }, function () {
                    $log.info('Cancel');
                    toastr.warning('Edit cancelled');
                });
            };

            $scope.onDeleteClick = function (p) {
                $log.info('Deleting post %o', p);
                var post = p,
                    modalInstance = $modal.open({
                        templateUrl: 'app/posts/delete.html',
                        controller: 'postDeleteController',
                        resolve: {
                            post: function () {
                                return post;
                            }
                        }
                    });

                modalInstance.result.then(function () {
                    post.destroy({
                        success: function (myObject) {
                            //refreshData($scope.currentPage);
                            toastr.success('Post deleted');
                        },
                        error: function (myObject, error) {

                        }
                    });
                }, function () {
                    $log.info('Cancel');
                    toastr.warning('Delete cancelled');
                });
            };
        }]);
}(angular, toastr));
(function (angular, Parse) {
    'use strict';

    Parse.initialize("HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1",
        "BxuS4AKpUCoP6Ea6pOn1O0PXlmPu5wYvvlSxLJVE");

    angular.module('app').factory('PostDataService', ['$log', '$q',
        function ($log, $q) {
            var res = {},
                PostModel = Parse.Object.extend({
                    className: 'Post'
                });

            res.getPost = function (aId) {
                var qry = new Parse.Query(PostModel);
                return qry.get(aId);
            };

            res.getPosts = function () {
                var qry = new Parse.Query(PostModel);
                qry.equalTo("published", true);
                qry.descending("publishDate");
                return qry.find();
            };

            res.deletePost = function (post) {
                return post.destroy();
            };

            return res;
        }]);
}(angular, Parse));