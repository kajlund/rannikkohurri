(function () {
    'use strict';

    function BookViewController ($scope, $location, $routeParams, $log, $modal, SessionService, bookDataService) {
        var vm = this,
            modalInstance,
            bookId = $routeParams.bookId;

        vm.canEdit = function () {
            return vm.loggedOn && bookId;
        };

        vm.edit = function () {
            var path = '/books/edit' + bookId;
            //$log.info(path);
            $location.path('/books/edit/' + bookId);
        };

        vm.delete = function () {
            modalInstance = $modal({
                scope: $scope,
                template: 'app/tmplVerify.html',
                show: true,
                title: 'Delete Book?',
                content: 'You are about to delete book <em>' + vm.book.title + '</em>'
            });
        };

        $scope.dlgVerifyCancel = function () {
            modalInstance.hide();
        };

        $scope.dlgVerifyOK = function () {
            modalInstance.hide();
            bookDataService.deleteItem(bookId)
                .then(function (data) {
                    $log.info('Deleted Book %o', data);
                    toastr.success('Book deleted');
                    $location.url('/books');
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                });
        };

        // Initialize Controller
        function init () {
            bookDataService.getItem(bookId)
                .then(function (res) {
                    vm.book = res.data;
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    $location.url('/books');
                }).then(function () {
                    vm.loggedOn = SessionService.loggedOn();
                    $log.info('*** Activated BookViewController');
                    $log.debug('   bookId      => %s', bookId);
                    $log.debug('   vm.book     => %o', vm.book);
                    $log.debug('   vm.loggedOn => ' + vm.loggedOn);
                });
        }


        if (!SessionService.loggedOn()) {
            SessionService.autoSignon()
                .then(function (data) {
                    toastr.success(data.username + ' signed on');
                    $log.debug('[ctrlBookView.autoSignon] success %o', data);
                }, function (err) {
                    $log.debug('[ctrlBookView.autoSignon] error %o', err);
                }).then(function () {
                    init();
                });
        } else {
            init();
        }
    }

    BookViewController.$inject = ['$scope', '$location', '$routeParams', '$log', '$modal', 'SessionService', 'bookDataService'];
    angular.module('app').controller('BookViewController', BookViewController);
}());