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