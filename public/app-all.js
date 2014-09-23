var angular = angular || null;

(function (angular) {
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
            color: '#333',
            zIndex: 2e9,
            left: 'auto',
            top: '200px'
        },
        app = angular.module('app', [
            // Angular modules
            'ui.router',     // state-based UI routing
            'ngAnimate',     // animate (for angular-strap)
            'ngCookies',     // cookies
            'infinite-scroll',
            'mgcrea.ngStrap', // angular-strap library
            'ngGrid'
        ]);

    // Configure Routes
    app.config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$modalProvider',
        function ($stateProvider, $urlRouterProvider, $httpProvider, $modalProvider) {
            $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1';
            $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L';
            angular.extend($modalProvider.defaults, {
                animation: 'am-fade-and-scale',
                placement: 'center',
                html: true
            });

            $urlRouterProvider.when("/posts", "/posts/list");
            $urlRouterProvider.otherwise('home');

            $stateProvider
                .state('home', {
                    url: '/home',
                    templateUrl: 'app/home.html',
                    controller: 'HomeController'
                }).state('posts', {
                    abstract: true,
                    url: '/posts',
                    templateUrl: 'app/posts/posts.html'
                }).state('posts.list', {
                    url: '/list',
                    templateUrl: 'app/posts/list.html',
                    controller: 'postListController'
                }).state('posts.detail', {
                    url: '/:slug',
                    templateUrl: 'app/posts/detail.html',
                    controller: 'PostDetailController'
                }).state('links', {
                    url: '/links',
                    templateUrl: 'app/links/links.html',
                    controller: 'LinksController'
                }).state('about', {
                    url: '/about',
                    templateUrl: 'app/about.html',
                    controller: 'AboutController'
                }).state('books', {
                    url: '/books',
                    templateUrl: 'app/books/list.html',
                    controller: 'bookListController'
                }).state('bookedit', {
                    url: '/books:bookId',
                    templateUrl: 'app/books/edit.html',
                    controller: 'bookEditController'
                }).state('movies', {
                    url: '/movies',
                    templateUrl: 'app/movies/list.html',
                    controller: 'movieListController'
                }).state('movieedit', {
                    url: '/movies:movieId',
                    templateUrl: 'app/movies/edit.html',
                    controller: 'movieEditController'
                }).state('events', {
                    url: '/events',
                    templateUrl: 'app/events/list.html',
                    controller: 'EventListController'
                }).state('eventedit', {
                    url: '/events:eventId',
                    templateUrl: 'app/events/edit.html',
                    controller: 'eventEditController'
                }).state('cheats', {
                    url: '/cheats',
                    templateUrl: 'app/cheats/list.html',
                    controller: 'cheatsListController'
                }).state('cheatsedit', {
                    url: '/cheats/:cacheId',
                    templateUrl: 'app/cheats/edit.html',
                    controller: 'cheatsEditController'
                });
        }]);

    app.run(['$rootScope', '$state', '$stateParams', '$log', '$window',
        function ($rootScope, $state, $stateParams, $log, $window) {

            $rootScope.busy = function (isBusy) {
                if (isBusy) {
                    if (!$rootScope.spinner) {
                        $rootScope.spinner = new $window.Spinner(spinnerOpts);
                    }
                    $rootScope.spinner.spin($window.document.documentElement);
                } else {
                    if ($rootScope.spinner) {
                        $rootScope.spinner.stop();
                    }
                }
            };
            // Configure Toastr library
            $window.toastr.options.timeOut = 2000;
            $window.toastr.options.positionClass = 'toast-bottom-right';
            // Configure marked library
            $window.marked.setOptions({gfm: true});
            // Configure moment library
            //$window.moment.lang('sv');
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
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

}(angular));
(function (angular) {
    'use strict';

    angular.module('app').controller('AboutController', ['$scope', '$rootScope', '$location', '$log',
        function ($scope, $rootScope, $location, $log) {

        }]);
}(angular));
var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('headerController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService) {
            var modalInstance = $modal({
                scope: $scope,
                template: 'app/signon.html',
                show: false
            });

            $scope.session = SessionService;
            $scope.user = { name: '', pwd: '' };

            $scope.getClass = function (path) {
                var className = "";

                if ($location.path().substr(0, path.length) === path) {
                    className = "active";
                }
                return className;
            };

            $scope.login = function () {
                modalInstance.hide();
                SessionService.signon($scope.user.name, $scope.user.pwd).then(function () {
                    toastr.info(SessionService.userObj.username + ' signed on');
                }, function (error) {
                    toastr.error(error.error);
                });
            };

            $scope.onSignonClick = function () {
                modalInstance.$promise.then(modalInstance.show);
            };

            $scope.onSignoffClick = function () {
                $log.info('Signing off');
                SessionService.signoff();
                toastr.warning('User signed off');
            };
        }]);
}(angular, toastr));
var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('HomeController', ['$scope', '$rootScope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $rootScope, $location, $log, $modal, SessionService) {
            $scope.session = SessionService;

            if (!SessionService.loggedOn()) {
                $rootScope.busy(true);
                $log.info('not logged on');
                SessionService.autoSignon()
                    .then(function (data) {
                        $log.info($scope.session);
                        $rootScope.busy(false);
                    }, function (err) {
                        $log.error(err);
                        $rootScope.busy(false);
                    });
            }
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
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('bookEditController', ['$scope', '$rootScope', '$state', '$log', 'SessionService', 'bookDataService',
        function ($scope, $rootScope, $state, $log, SessionService, bookDataService) {
            $scope.session = SessionService;
            $scope.bookId = $rootScope.$stateParams.bookId;
            $scope.languages = [
                'swe',
                'eng',
                'fin'
            ];
            $scope.genres = [
                'Biography',
                'History',
                'Kids',
                'Misc',
                'Novel',
                'Science',
                'Technology'
            ];

            if ($scope.bookId === '_new') {
                $scope.book = {
                    authors: "",
                    genre: "",
                    image: "",
                    lang: "",
                    subtitle: "",
                    title: ""
                };
            } else {
                bookDataService.getItem($scope.bookId)
                    .then(function (res) {
                        $scope.book = res.data;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('books');
                    });
            }

            $scope.save = function () {
                bookDataService.updateItem($scope.book)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Book %o', res);
                        toastr.success('Book saved');
                        $state.go('books');
                    }, function (err) {
                        $log.error('Error saving Book %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('books');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $state.go('books');
            };
        }]);
}(angular.module('app')));
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('bookListController', ['$scope', '$rootScope', '$state', '$log', '$modal', 'SessionService', 'bookDataService',
        function ($scope, $rootScope, $state, $log, $modal, SessionService, bookDataService) {
            var modalInstance = null;

            function getItems() {
                if ($scope.fetching) {
                    return;
                }
                $scope.fetching = true;
                $rootScope.busy(true);
                bookDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
                    .then(function (res) {
                        $scope.items = $scope.items.concat(res.data.results);
                        $scope.totalItems = res.data.count;
                        $rootScope.busy(false);
                        $scope.fetching = false;
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $scope.fetching = false;
                    });
            }

            $scope.session = SessionService;
            $scope.filter = '';
            $scope.currentPage = 1;
            $scope.maxSize = 10;
            $scope.order = 'title';
            $scope.totalItems = 0;
            $scope.currentItem = null;
            $scope.items = [];
            $scope.fetching = false;

            getItems();

            $scope.onAddClick = function () {
                $state.go('bookedit', {'bookId': '_new'});
            };

            $scope.onEditClick = function (book) {
                $state.go('bookedit', {'bookId': book.objectId});
            };

            $scope.onDeleteClick = function (book) {
                $scope.currentItem = book;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Book?',
                    content: 'You are about to delete book <em>' + book.title + '</em>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                $rootScope.busy(true);
                bookDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Book');
                        toastr.success('Book deleted');
                        $scope.items = _.filter($scope.items, function (book) {
                            return book.objectId !== $scope.currentItem.objectId;
                        });
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);

                    });
            };

            $scope.scroll = function () {
                $scope.currentPage += 1;
                getItems();
            };
        }]);
}(angular.module('app')));
var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').factory('bookDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/AudioBook',
                res = {};

            res.pageSize = 100;
            res.getItem = function (aId) {
                var config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        isArray: false,
                        method: 'GET',
                        url: baseUrl + '/' + aId
                    };
                return $http(config);
            };

            res.getItems = function () {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?count=1&limit=1000&order=title'
                };
                return $http(config);
            };

            res.getPage = function (aOrder, aFilter, aPageNum) {
                var where = aFilter === '' ? '' : '&where={"' + aOrder + '":{"$gte":"' + aFilter + '"}}',
                    skip = (aPageNum - 1) * res.pageSize,
                    params = '?count=1&limit=' + res.pageSize + '&skip=' + skip + '&order=' + aOrder + where,
                    config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        isArray: false,
                        method: 'GET',
                        url: baseUrl + params
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
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('cheatsEditController', ['$scope', '$rootScope', '$state', '$log', 'SessionService', 'cheatsDataService',
        function ($scope, $rootScope, $state, $log, SessionService, cheatsDataService) {
            $scope.session = SessionService;
            $scope.cacheId = $rootScope.$stateParams.cacheId;
            $scope.cacheTypes = [
                'Tradi',
                'Mystery',
                'Multi',
                'Chirp',
                'Earth',
                'Letterbox',
                'Event',
                'Lab',
                'Virtual',
                'Wherigo'
            ];
            $scope.municipalities = [
                'Akaa', 'Alajärvi', 'Alavieska', 'Alavus', 'Asikkala', 'Askola', 'Aura', 'Brändö',
                'Eckerö', 'Enonkoski', 'Enontekiö', 'Espoo', 'Eura', 'Eurajoki', 'Evijärvi', 'Finström',
                'Forssa', 'Föglö', 'Geta', 'Haapajärvi', 'Haapavesi', 'Hailuoto', 'Halsua', 'Hamina',
                'Hammarland', 'Hankasalmi', 'Hanko', 'Harjavalta', 'Hartola', 'Hattula', 'Hausjärvi',
                'Heinola', 'Heinävesi', 'Helsinki', 'Hirvensalmi', 'Hollola', 'Honkajoki', 'Huittinen',
                'Humppila', 'Hyrynsalmi', 'Hyvinkää', 'Hämeenkoski', 'Hämeenkyrö', 'Hämeenlinna', 'Ii',
                'Iisalmi', 'Iitti', 'Ikaalinen', 'Ilmajoki', 'Ilomantsi', 'Imatra', 'Inari', 'Inkoo',
                'Isojoki', 'Isokyrö', 'Jalasjärvi', 'Janakkala', 'Joensuu', 'Jokioinen', 'Jomala',
                'Joroinen', 'Joutsa', 'Juankoski', 'Juuka', 'Juupajoki', 'Juva', 'Jyväskylä', 'Jämijärvi',
                'Jämsä', 'Järvenpää', 'Kaarina', 'Kaavi', 'Kajaani', 'Kalajoki', 'Kangasala', 'Kangasniemi',
                'Kankaanpää', 'Kannonkoski', 'Kannus', 'Karijoki', 'Karkkila', 'Karstula', 'Karvia',
                'Kaskinen', 'Kauhajoki', 'Kauhava', 'Kauniainen', 'Kaustinen', 'Keitele', 'Kemi',
                'Kemijärvi', 'Keminmaa', 'Kemiönsaari', 'Kempele', 'Kerava', 'Keuruu', 'Kihniö',
                'Kinnula', 'Kirkkonummi', 'Kitee', 'Kittilä', 'Kiuruvesi', 'Kivijärvi', 'Kokemäki',
                'Kokkola', 'Kolari', 'Konnevesi', 'Kontiolahti', 'Korsnäs', 'Koski Tl', 'Kotka',
                'Kouvola', 'Kristiinankaupunki', 'Kruunupyy', 'Kuhmo', 'Kuhmoinen', 'Kumlinge', 'Kuopio',
                'Kuortane', 'Kurikka', 'Kustavi', 'Kuusamo', 'Kyyjärvi', 'Kärkölä', 'Kärsämäki', 'Kökar',
                'Köyliö', 'Lahti', 'Laihia', 'Laitila', 'Lapinjärvi', 'Lapinlahti', 'Lappajärvi',
                'Lappeenranta', 'Lapua', 'Laukaa', 'Lavia', 'Lemi', 'Lemland', 'Lempäälä', 'Leppävirta',
                'Lestijärvi', 'Lieksa', 'Lieto', 'Liminka', 'Liperi', 'Lohja', 'Loimaa', 'Loppi',
                'Loviisa', 'Luhanka', 'Lumijoki', 'Lumparland', 'Luoto', 'Luumäki', 'Luvia', 'Maalahti',
                'Maaninka', 'Maarianhamina', 'Marttila', 'Masku', 'Merijärvi', 'Merikarvia', 'Miehikkälä',
                'Mikkeli', 'Muhos', 'Multia', 'Muonio', 'Mustasaari', 'Muurame', 'Mynämäki', 'Myrskylä',
                'Mäntsälä', 'Mänttä-Vilppula', 'Mäntyharju', 'Naantali', 'Nakkila', 'Nastola', 'Nivala',
                'Nokia', 'Nousiainen', 'Nurmes', 'Nurmijärvi', 'Närpiö', 'Orimattila', 'Oripää', 'Orivesi',
                'Oulainen', 'Oulu', 'Outokumpu', 'Padasjoki', 'Paimio', 'Paltamo', 'Parainen', 'Parikkala',
                'Parkano', 'Pedersöre', 'Pelkosenniemi', 'Pello', 'Perho', 'Pertunmaa', 'Petäjävesi',
                'Pieksämäki', 'Pielavesi', 'Pietarsaari', 'Pihtipudas', 'Pirkkala', 'Polvijärvi',
                'Pomarkku', 'Pori', 'Pornainen', 'Porvoo', 'Posio', 'Pudasjärvi', 'Pukkila', 'Punkalaidun',
                'Puolanka', 'Puumala', 'Pyhtää', 'Pyhäjoki', 'Pyhäjärvi', 'Pyhäntä', 'Pyhäranta', 'Pälkäne',
                'Pöytyä', 'Raahe', 'Raasepori', 'Raisio', 'Rantasalmi', 'Ranua', 'Rauma', 'Rautalampi',
                'Rautavaara', 'Rautjärvi', 'Reisjärvi', 'Riihimäki', 'Ristijärvi', 'Rovaniemi', 'Ruokolahti',
                'Ruovesi', 'Rusko', 'Rääkkylä', 'Saarijärvi', 'Salla', 'Salo', 'Saltvik', 'Sastamala',
                'Sauvo', 'Savitaipale', 'Savonlinna', 'Savukoski', 'Seinäjoki', 'Sievi', 'Siikainen',
                'Siikajoki', 'Siikalatva', 'Siilinjärvi', 'Simo', 'Sipoo', 'Siuntio', 'Sodankylä', 'Soini',
                'Somero', 'Sonkajärvi', 'Sotkamo', 'Sottunga', 'Sulkava', 'Sund', 'Suomussalmi', 'Suonenjoki',
                'Sysmä', 'Säkylä', 'Taipalsaari', 'Taivalkoski', 'Taivassalo', 'Tammela', 'Tampere',
                'Tarvasjoki', 'Tervo', 'Tervola', 'Teuva', 'Tohmajärvi', 'Toholampi', 'Toivakka', 'Tornio',
                'Turku', 'Tuusniemi', 'Tuusula', 'Tyrnävä', 'Ulvila', 'Urjala', 'Utajärvi', 'Utsjoki',
                'Uurainen', 'Uusikaarlepyy', 'Uusikaupunki', 'Vaala', 'Vaasa', 'Valkeakoski', 'Valtimo',
                'Vantaa', 'Varkaus', 'Vehmaa', 'Vesanto', 'Vesilahti', 'Veteli', 'Vieremä', 'Vihti',
                'Viitasaari', 'Vimpeli', 'Virolahti', 'Virrat', 'Vårdö', 'Vöyri', 'Ylitornio', 'Ylivieska',
                'Ylöjärvi', 'Ypäjä', 'Ähtäri', 'Äänekoski'
            ];

            if ($scope.cacheId === '_new') {
                $scope.cache = {
                    cacheId: '',
                    cacheType: '',
                    name: '',
                    coords: '',
                    verifiedCoords: false
                };
            } else {
                cheatsDataService.getItem($scope.cacheId)
                    .then(function (res) {
                        $scope.cache = res.data;
                        $scope.currentType = $scope.cache.cacheType;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('cheats');
                    });
            }

            $scope.save = function () {
                cheatsDataService.updateItem($scope.cache)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Cache %o', res);
                        toastr.success('Cache saved');
                        $state.go('cheats');
                    }, function (err) {
                        $log.error('Error saving Cache %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('cheats');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $state.go('cheats');
            };
        }]);
}(angular.module('app')));
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('cheatsListController', ['$scope', '$rootScope', '$state', '$log', '$modal', 'SessionService', 'cheatsDataService',
        function ($scope, $rootScope, $state, $log, $modal, SessionService, cheatsDataService) {
            var modalInstance = null,
                linkCellTemplate = '<div class="ngCellText" ng-class="col.colIndex()">' +
                    '  <a target="_blank" href="http://coord.info/{{row.entity.cacheId}}">{{row.getProperty(col.field)}}</a>' +
                    '</div>',
                commandsCellTemplate = '<div class="ngCellText" ng-class="col.colIndex()">' +
                    '  <div class="btn-group">' +
                    '    <button type="button" class="btn btn-primary" data-ng-click="onEditClick(row.entity)">' +
                    '        <i class="fa fa-edit"></i>' +
                    '    </button>' +
                    '    <button type="button" class="btn btn-danger" data-ng-click="onDeleteClick(row.entity)">' +
                    '      <i class="fa fa-trash-o"></i>' +
                    '    </button>' +
                    '  </div>' +
                    '</div>';

            $scope.gridOptions = {
                data: 'items',
                rowHeight: 44,
                multiSelect: false,
                showGroupPanel: true,
                columnDefs: [
                    {field: 'cacheId', displayName: 'Id', width: '100', cellTemplate: linkCellTemplate},
                    {field: 'updatedAt', displayName: 'Updated', cellFilter: 'date', width: '100'},
                    {field: 'cacheType', displayName: 'Type', width: '100'},
                    {field: 'name', displayName: 'Name'},
                    {field: 'municipality', displayName: 'Municipality', width: '150'},
                    {field: 'coords', displayName: 'Coords'},
                    {field: 'verifiedCoords', displayName: 'Verified', width: '66'},
                    {field: 'objectId', displayName: 'Commands', width: '86', cellTemplate: commandsCellTemplate}
                ]
            };

            function getItems() {
                $rootScope.busy(true);
                cheatsDataService.getItems()
                    .then(function (res) {
                        $log.info(res);
                        $scope.items = res.data.results;
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            $scope.session = SessionService;
            $scope.totalItems = 0;
            $scope.currentItem = null;

            getItems();

            $scope.onAddClick = function () {
                $state.go('cheatsedit', {'eventId': '_new'});
            };

            $scope.onEditClick = function (cache) {
                $state.go('cheatsedit', {'cacheId': cache.objectId});
            };

            $scope.onDeleteClick = function (cache) {
                $scope.currentItem = cache;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Cache?',
                    content: 'You are about to delete cache <strong>' + cache.name + '</strong>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                $rootScope.busy(true);
                cheatsDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Cache');
                        toastr.success('Cache deleted');
                        $scope.items = _.filter($scope.items, function (cache) {
                            return cache.objectId !== $scope.currentItem.objectId;
                        });
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);

                    });
            };
        }]);
}(angular.module('app')));
var angular = angular || null;

(function (app) {
    'use strict';

    app.factory('cheatsDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/Cheat',
                res = {};

            res.municipalities = [

            ];

            res.getItem = function (aId) {
                var config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        isArray: false,
                        method: 'GET',
                        url: baseUrl + '/' + aId
                    };
                return $http(config);
            };

            res.getItems = function () {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?count=1&limit=1000&order=name'
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
}(angular.module('app')));
var angular = angular || null,
    toastr = toastr || null;

(function (angular) {
    'use strict';

    angular.module('app').controller('eventEditController', ['$scope', '$rootScope', '$state', '$log', 'SessionService', 'eventDataService',
        function ($scope, $rootScope, $state, $log, SessionService, eventDataService) {
            $scope.session = SessionService;
            $scope.eventId = $rootScope.$stateParams.eventId;

            if ($scope.eventId === '_new') {
                $scope.event = {
                    starts: '',
                    eventName: '',
                    placeName: '',
                    organizer: '',
                    organizerUrl: '',
                    smartum: false
                };
            } else {
                eventDataService.getEvent($scope.eventId)
                    .then(function (res) {
                        $scope.event = res.data;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('events');
                    });
            }

            $scope.save = function () {
                eventDataService.updateItem($scope.event)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Event %o', res);
                        toastr.success('Event saved');
                        $state.go('events');
                    }, function (err) {
                        $log.error('Error saving Event %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('events');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $state.go('events');
            };
        }]);
}(angular));
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('EventListController', ['$scope', '$rootScope', '$state', '$log', '$modal', 'SessionService', 'eventDataService',
        function ($scope, $rootScope, $state, $log, $modal, SessionService, eventDataService) {
            var modalInstance = null;

            function getEvents() {
                $rootScope.busy(true);
                eventDataService.getEvents()
                    .then(function (res) {
                        $scope.events = res.data.results;
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            $scope.session = SessionService;
            $scope.totalItems = 0;
            $scope.currentItem = null;

            getEvents();

            $scope.onAddClick = function () {
                $state.go('eventedit', {'eventId': '_new'});
            };

            $scope.onEditClick = function (event) {
                $state.go('eventedit', {'eventId': event.objectId});
            };

            $scope.onDeleteClick = function (event) {
                $scope.currentItem = event;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Event?',
                    content: 'You are about to delete event <em>' + event.eventName + '/' + event.placeName + '</em>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                $rootScope.busy(true);
                eventDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Event');
                        toastr.success('Event deleted');
                        $scope.events = _.filter($scope.events, function (event) {
                            return event.objectId !== $scope.currentItem.objectId;
                        });
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);

                    });
            };
        }]);
}(angular.module('app')));
var angular = angular || null;

(function (angular) {
    'use strict';

    angular.module('app').factory('eventDataService', ['$log', '$q', '$http', 'SessionService',
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
var angular = angular || null,
    toastr = toastr || null;

(function (app, toastr) {
    'use strict';

    app.controller('movieEditController', ['$scope', '$rootScope', '$state', '$log', 'SessionService', 'movieDataService',
        function ($scope, $rootScope, $state, $log, SessionService, movieDataService) {
            $scope.session = SessionService;
            $scope.movieId = $rootScope.$stateParams.movieId;

            if ($scope.movieId === '_new') {
                $scope.movie = {
                    seenAt: {"__type": "Date", "iso": new Date().toISOString()},
                    etitle: "",
                    otitle: "",
                    pic: "",
                    rating: 0,
                    url: "",
                    synopsis: "",
                    comment: ""
                };
            } else {
                movieDataService.getItem($scope.movieId)
                    .then(function (res) {
                        $scope.movie = res.data;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('movies');
                    });
            }

            $scope.save = function () {
                movieDataService.updateItem($scope.movie)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Movie %o', res);
                        toastr.success('Movie saved');
                        $state.go('movies');
                    }, function (err) {
                        $log.error('Error saving Movie %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $state.go('movies');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $state.go('movies');
            };
        }]);
}(angular.module('app'), toastr));
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('movieListController', ['$scope', '$rootScope', '$modal', '$log', '$state', 'SessionService', 'movieDataService',
        function ($scope, $rootScope, $modal, $log, $state, SessionService, movieDataService) {
            var modalInstance = null;

            function getItems() {
                if ($scope.fetching) {
                    return;
                }
                $scope.fetching = true;
                $rootScope.busy(true);
                movieDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
                    .then(function (res) {
                        $scope.items = $scope.items.concat(res.data.results);
                        $scope.totalItems = res.data.count;
                        $rootScope.busy(false);
                        $scope.fetching = false;
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $scope.fetching = false;
                    });
            }

            $scope.session = SessionService;
            $scope.filter = '';
            $scope.currentPage = 1;
            $scope.maxSize = 10;
            $scope.order = '-seenAt';
            $scope.totalItems = 0;
            $scope.currentItem = null;
            $scope.items = [];
            $scope.fetching = false;

            getItems();

            $scope.onAddClick = function () {
                $state.go('movieedit', {'movieId': '_new'});
            };

            $scope.onEditClick = function (movie) {
                $state.go('movieedit', {'movieId': movie.objectId});
            };

            $scope.onDeleteClick = function (movie) {
                $scope.currentItem = movie;
                modalInstance = $modal({
                    scope: $scope,
                    template: 'app/tmplVerify.html',
                    show: true,
                    title: 'Delete Movie?',
                    content: 'You are about to delete movie <em>' + movie.etitle + '</em>'
                });
            };

            $scope.dlgVerifyCancel = function () {
                modalInstance.hide();
                toastr.warning('Delete cancelled');
            };

            $scope.dlgVerifyOK = function () {
                modalInstance.hide();
                $rootScope.busy(true);
                movieDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Movie');
                        toastr.success('Movie deleted');
                        $scope.items = _.filter($scope.items, function (movie) {
                            return movie.objectId !== $scope.currentItem.objectId;
                        });
                        $rootScope.busy(false);
                    }, function (err) {
                        $rootScope.busy(false);
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            };

            $scope.scroll = function () {
                $scope.currentPage += 1;
                getItems();
            };
        }]);
}(angular.module('app')));
var angular = angular || null;

(function (app) {
    'use strict';

    app.factory('movieDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/Movie',
                res = {};

            res.pageSize = 100;
            res.getItem = function (aId) {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '/' + aId
                };
                return $http(config);
            };

            res.getItems = function () {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?count=1&limit=1000&order=-seenAt'
                };
                return $http(config);
            };

            res.getPage = function (aOrder, aFilter, aPageNum) {
                var where = aFilter === '' ? '' : '&where={"' + aOrder + '":{"$gte":"' + aFilter + '"}}',
                    skip = (aPageNum - 1) * res.pageSize,
                    params = '?count=1&limit=' + res.pageSize + '&skip=' + skip + '&order=' + aOrder + where,
                    config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        isArray: false,
                        method: 'GET',
                        url: baseUrl + params
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
}(angular.module('app')));
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
var angular = angular || null,
    marked = marked || null,
    toastr = toastr || null;

(function (angular, marked, toastr) {
    'use strict';

    angular.module('app').controller('PostDetailController', ['$scope', '$rootScope', '$stateParams', '$http', '$sce', '$log', 'PostDataService',
        function ($scope, $rootScope, $stateParams, $http, $sce, $log, PostDataService) {
            $scope.currentPost = null;
            $rootScope.busy(true);

            function renderData(aPost) {
                $log.info('slug = ' + aPost.slug);
                $http.get('/dropbox/' + aPost.slug)
                    .then(function (res) {
                        $scope.markdown = $sce.trustAsHtml(marked(res.data));
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            if ($stateParams.slug) {
                $log.info('post = ' + $stateParams.slug);
                PostDataService.getPost($stateParams.slug)
                    .then(function (res) {
                        $log.info('res = %o', res);
                        $scope.currentPost = res.data.results[0];
                        $scope.title = $scope.currentPost.title;
                        renderData($scope.currentPost);
                        $rootScope.busy(false);
                    },  function (err) {
                        $rootScope.busy(false);
                        $scope.currentPost = null;
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }
        }]);
}(angular, marked, toastr));
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
var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('postListController', ['$scope', '$rootScope', '$log', '$modal', 'PostDataService',
        function ($scope, $rootScope, $log, $modal, PostDataService) {
            $rootScope.busy(true);

            PostDataService.getPosts()
                .then(function (res) {
                    $log.info(res);
                    $scope.posts = res.data.results;
                    $rootScope.busy(false);
                }, function (err) {
                    $rootScope.busy(false);
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
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
var angular = angular || null;

(function (app) {
    'use strict';

    app.factory('PostDataService', ['$log', '$q', '$http', 'SessionService',
        function ($log, $q, $http, SessionService) {
            var baseUrl = 'https://api.parse.com/1/classes/Post',
                res = {};

            res.getPost = function (aSlug) {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?where={"slug":"' + aSlug + '"}'
                };
                return $http(config);
            };

            res.getPosts = function () {
                var config = {
                    headers: {
                        'X-Parse-Session-Token': SessionService.sessionToken
                    },
                    isArray: false,
                    method: 'GET',
                    url: baseUrl + '?where={"published":true}&count=1&limit=1000&order=-publishDate'
                };
                return $http(config);
            };

            res.deletePost = function (post) {
                var config = {
                        headers: {
                            'X-Parse-Session-Token': SessionService.sessionToken
                        },
                        method: 'DELETE',
                        url: baseUrl + '/' + post.objectId
                    };
                return $http(config);
            };

            return res;
        }]);
}(angular.module('app')));