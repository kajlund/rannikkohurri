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