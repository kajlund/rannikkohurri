(function (app) {
    'use strict';

    angular
        .module('app')
        .controller('CheatsListController', CheatsListController);

    /* @ngInject */
    CheatsListController.$inject = ['$location', '$log', '$modal', 'sessionService', 'cheatsDataService', 'toastr', '_'];
    function CheatsListController ($location, $log, $modal, sessionService, cheatsDataService, _) {
        var vm = this,
            modalInstance = null,
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

        vm.dlgVerifyCancel = dlgVerifyCancel;
        vm.dlgVerifyOK = dlgVerifyOK;
        vm.onAddClick = onAddClick;
        vm.onDeleteClick = onDeleteClick;
        vm.onEditClick = onEditClick;
        vm.totalItems = 0;
        vm.currentItem = null;
        vm.session = sessionService;
        vm.gridOptions = {
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

        activate();

        //////////////////////////////////////////////////////////////////////////////////

        function activate () {
            if (!sessionService.loggedOn()) {
                sessionService.autoSignon()
                    .then(function (data) {
                        $log.info(vm.session);
                    }, function (err) {
                        $log.error(err);
                    });
            }
            getItems();
        }

        function getItems () {
            if (sessionService.userObj) {
                cheatsDataService.getItems()
                    .then(function (res) {
                        $log.info(res);
                        vm.items = res.data.results;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.data.code + ' ' + err.data.error);
                    });
            }
        }

        function onAddClick () {
            $location.path('/cheats/_new');
        }

        function onEditClick (cache) {
            $location.path('/cheats/' + cache.objectId);
        }

        function onDeleteClick (cache) {
            vm.currentItem = cache;
            modalInstance = $modal({
                scope: vm,
                template: 'app/tmplVerify.html',
                show: true,
                title: 'Delete Cache?',
                content: 'You are about to delete cache <strong>' + cache.name + '</strong>'
            });
        }

        function dlgVerifyCancel () {
            modalInstance.hide();
            toastr.warning('Delete cancelled');
        }

        function dlgVerifyOK () {
            modalInstance.hide();
            cheatsDataService.deleteItem(vm.currentItem)
                .then(function (data) {
                    $log.info('Deleted Cache');
                    toastr.success('Cache deleted');
                    vm.items = _.filter(vm.items, function (cache) {
                        return cache.objectId !== vm.currentItem.objectId;
                    });
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                });
        }
    }
}());