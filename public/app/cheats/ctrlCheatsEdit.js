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
                'Earth',
                'Letterbox',
                'Event',
                'Lab',
                'Virtual'
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