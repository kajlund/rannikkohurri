var angular = angular || null;

(function (angular) {
    'use strict';

    var app = angular.module('app', [
            // Angular modules
            'ngRoute',          // routing
            'ngAnimate',        // animate (for angular-strap)
            'ngCookies',        // cookies
            'infinite-scroll',
            'mgcrea.ngStrap',   // angular-strap library
            'ngGrid',
            'angular-loading-bar'
        ]);

    // Configure Routes
    app.config(['$routeProvider', '$locationProvider', '$httpProvider', '$modalProvider',
        function ($routeProvider, $locationProvider, $httpProvider, $modalProvider) {
            //$locationProvider.html5Mode(true);
            $httpProvider.defaults.headers.common['X-Parse-Application-Id'] = 'HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1';
            $httpProvider.defaults.headers.common['X-Parse-REST-API-Key'] = 'LZqwu8VIutbaphzVoPW7yf4RxkKQAMbAapwubT5L';
            angular.extend($modalProvider.defaults, {
                animation: 'am-fade-and-scale',
                placement: 'center',
                html: true
            });

            $routeProvider.when('/', {
                templateUrl: 'app/home.html',
                controller: 'HomeController'
            }).when('/books', {
                templateUrl: 'app/books/list.html',
                controller: 'bookListController'
            }).when('/books/:bookId', {
                templateUrl: 'app/books/edit.html',
                controller: 'bookEditController'
            }).when('/movies', {
                templateUrl: 'app/movies/list.html',
                controller: 'movieListController'
            }).when('/movies/:movieId', {
                templateUrl: 'app/movies/edit.html',
                controller: 'movieEditController'
            }).when('/events', {
                templateUrl: 'app/events/list.html',
                controller: 'EventListController'
            }).when('/events/:eventId', {
                templateUrl: 'app/events/edit.html',
                controller: 'eventEditController'
            }).when('/cheats', {
                templateUrl: 'app/cheats/list.html',
                controller: 'cheatsListController'
            }).when('/cheats/:cacheId', {
                templateUrl: 'app/cheats/edit.html',
                controller: 'cheatsEditController'
            }).otherwise({ redirectTo: '/' });
        }]);

    app.run(['$log', '$window',
        function ($log, $window) {
            // Configure Toastr library
            $window.toastr.options.timeOut = 2000;
            $window.toastr.options.positionClass = 'toast-bottom-right';
            // Configure moment library
            //$window.moment.lang('sv');
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
var angular = angular || null,
    toastr = toastr || null;

(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('headerController', ['$scope', '$location', '$log', '$modal', 'SessionService',
        function ($scope, $location, $log, $modal, SessionService) {
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

    angular.module('app').controller('HomeController', ['$scope', '$log', 'SessionService',
        function ($scope, $log, SessionService) {
            $scope.session = SessionService;
            $log.info('Activating HomeController');

            if (!SessionService.loggedOn()) {
                $log.info('not logged on');
                SessionService.autoSignon()
                    .then(function (data) {
                        $log.info($scope.session);
                    }, function (err) {
                        $log.error(err);
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

    app.controller('bookEditController', ['$scope', '$routeParams', '$location', '$log', 'SessionService', 'bookDataService',
        function ($scope, $routeParams, $location, $log, SessionService, bookDataService) {
            $scope.session = SessionService;
            $scope.bookId = $routeParams.bookId;
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
                        $location.url('/books');
                    });
            }

            $scope.save = function () {
                bookDataService.updateItem($scope.book)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Book %o', res);
                        toastr.success('Book saved');
                        $location.url('/books');
                    }, function (err) {
                        $log.error('Error saving Book %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $location.url('/books');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $location.url('/books');
            };
        }]);
}(angular.module('app')));
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('bookListController', ['$scope', '$location', '$log', '$modal', 'SessionService', 'bookDataService',
        function ($scope, $location, $log, $modal, SessionService, bookDataService) {
            var modalInstance = null;

            function getItems() {
                if ($scope.fetching) {
                    return;
                }
                $scope.fetching = true;
                bookDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
                    .then(function (res) {
                        $scope.items = $scope.items.concat(res.data.results);
                        $scope.totalItems = res.data.count;
                        $scope.fetching = false;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $scope.fetching = false;
                    });
            }

            $log.info('Activating bookListController');
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
                $location.path('/books/_new');
            };

            $scope.onEditClick = function (book) {
                $location.path('/books/' + book.objectId);
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
                bookDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Book %o', data);
                        toastr.success('Book deleted');
                        $scope.items = _.filter($scope.items, function (book) {
                            return book.objectId !== $scope.currentItem.objectId;
                        });
                    }, function (err) {
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

    app.controller('cheatsEditController', ['$scope', '$routeParams', '$location', '$log', 'SessionService', 'cheatsDataService',
        function ($scope, $routeParams, $location, $log, SessionService, cheatsDataService) {
            $scope.session = SessionService;
            $scope.cacheId = $routeParams.cacheId;
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
                        $location.url('/cheats');
                    });
            }

            $scope.save = function () {
                cheatsDataService.updateItem($scope.cache)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Cache %o', res);
                        toastr.success('Cache saved');
                        $location.url('/cheats');
                    }, function (err) {
                        $log.error('Error saving Cache %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $location.url('/cheats');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $location.url('/cheats');
            };
        }]);
}(angular.module('app')));
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('cheatsListController', ['$scope', '$location', '$log', '$modal', 'SessionService', 'cheatsDataService',
        function ($scope, $location, $log, $modal, SessionService, cheatsDataService) {
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
                if (SessionService.userObj) {
                    cheatsDataService.getItems()
                        .then(function (res) {
                            $log.info(res);
                            $scope.items = res.data.results;
                        }, function (err) {
                            $log.error(err);
                            toastr.error(err.data.code + ' ' + err.data.error);
                        });
                }
            }

            $scope.session = SessionService;
            $scope.totalItems = 0;
            $scope.currentItem = null;

            getItems();

            $scope.onAddClick = function () {
                $location.path('/cheats/_new');
            };

            $scope.onEditClick = function (cache) {
                $location.path('/cheats/' + cache.objectId);
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
                cheatsDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Cache');
                        toastr.success('Cache deleted');
                        $scope.items = _.filter($scope.items, function (cache) {
                            return cache.objectId !== $scope.currentItem.objectId;
                        });
                    }, function (err) {
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

    angular.module('app').controller('eventEditController', ['$scope', '$routeParams', '$location', '$log', 'SessionService', 'eventDataService',
        function ($scope, $routeParams, $location, $log, SessionService, eventDataService) {
            $scope.session = SessionService;
            $scope.eventId = $routeParams.eventId;

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
                        $location.url('/events');
                    });
            }

            $scope.save = function () {
                eventDataService.updateItem($scope.event)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Event %o', res);
                        toastr.success('Event saved');
                        $location.url('/events');
                    }, function (err) {
                        $log.error('Error saving Event %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $location.url('/events');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $location.url('/events');
            };
        }]);
}(angular));
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('EventListController', ['$scope', '$location', '$log', '$modal', 'SessionService', 'eventDataService',
        function ($scope, $location, $log, $modal, SessionService, eventDataService) {
            var modalInstance = null;

            function getEvents() {
                eventDataService.getEvents()
                    .then(function (res) {
                        $scope.events = res.data.results;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                    });
            }

            $scope.session = SessionService;
            $scope.totalItems = 0;
            $scope.currentItem = null;

            getEvents();

            $scope.onAddClick = function () {
                $location.path('/events/_new');
            };

            $scope.onEditClick = function (event) {
                $location.path('/events/' + event.objectId);
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
                eventDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Event');
                        toastr.success('Event deleted');
                        $scope.events = _.filter($scope.events, function (event) {
                            return event.objectId !== $scope.currentItem.objectId;
                        });
                    }, function (err) {
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

    app.controller('movieEditController', ['$scope', '$routeParams', '$location', '$log', 'SessionService', 'movieDataService',
        function ($scope, $routeParams, $location, $log, SessionService, movieDataService) {
            $scope.session = SessionService;
            $scope.movieId = $routeParams.movieId;

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
                        $location.url('/movies');
                    });
            }

            $scope.save = function () {
                movieDataService.updateItem($scope.movie)
                    .then(function (res) {
                        // data.createdAt data.objectId
                        $log.info('Saved Movie %o', res);
                        toastr.success('Movie saved');
                        $location.url('/movies');
                    }, function (err) {
                        $log.error('Error saving Movie %o', err);
                        toastr.error(err.error.code + ' ' + err.error.error);
                        $location.url('/movies');
                    });
            };

            $scope.cancel = function () {
                $log.info('Cancelled Edit');
                toastr.warning('Edit cancelled');
                $location.url('/movies');
            };
        }]);
}(angular.module('app'), toastr));
var angular = angular || null,
    toastr = toastr || null;

(function (app) {
    'use strict';

    app.controller('movieListController', ['$scope', '$location', '$modal', '$log', 'SessionService', 'movieDataService',
        function ($scope, $location, $modal, $log, SessionService, movieDataService) {
            var modalInstance = null;

            function getItems() {
                if ($scope.fetching) {
                    return;
                }
                $scope.fetching = true;
                movieDataService.getPage($scope.order, $scope.filter, $scope.currentPage)
                    .then(function (res) {
                        $scope.items = $scope.items.concat(res.data.results);
                        $scope.totalItems = res.data.count;
                        $scope.fetching = false;
                    }, function (err) {
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
                $location.path('/movies/_new');
            };

            $scope.onEditClick = function (movie) {
                $location.path('/movies/' + movie.objectId);
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
                movieDataService.deleteItem($scope.currentItem)
                    .then(function (data) {
                        $log.info('Deleted Movie');
                        toastr.success('Movie deleted');
                        $scope.items = _.filter($scope.items, function (movie) {
                            return movie.objectId !== $scope.currentItem.objectId;
                        });
                    }, function (err) {
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