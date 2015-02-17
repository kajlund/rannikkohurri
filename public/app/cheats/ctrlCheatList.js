(function (app) {
    'use strict';

    angular
        .module('app')
        .controller('CheatListController', CheatListController);

    /* @ngInject */
    CheatListController.$inject = ['$location', '$log', '$modal', 'sessionService', 'cheatDataService', 'toastr', '_'];
    function CheatListController ($location, $log, $modal, sessionService, cheatDataService, _) {
        var vm = this,
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

        vm.onAddClick = onAddClick;
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
            $log.info('Activating CheatListController');
            getItems();
        }

        function getItems () {
                cheatDataService.getItems()
                    .then(function (res) {
                        $log.info(res);
                        vm.items = res.data.results;
                    }, function (err) {
                        $log.error(err);
                        toastr.error(err.data.code + ' ' + err.data.error);
                    });
        }

        function onAddClick () {
            $location.path('/cheats/edit/_new');
        }

        function onEditClick (cache) {
            $location.path('/cheats/edit/' + cache.objectId);
        }
    }
}());