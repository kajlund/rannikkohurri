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
                $state.go('cheatsedit', {'cacheId': '_new'});
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