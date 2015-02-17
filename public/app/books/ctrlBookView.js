(function () {
    'use strict';

    angular
        .module('app')
        .controller('BookViewController', BookViewController);

    /* @ngInject */
    BookViewController.$inject = ['$location', '$routeParams', '$log', '$modal', 'sessionService', 'bookDataService'];

    function BookViewController ($location, $routeParams, $log, $modal, sessionService, bookDataService) {
        var vm = this,
            bookId = $routeParams.bookId;

        vm.book = null;
        vm.canEdit = canEdit;
        vm.delete = doDelete;
        vm.edit = edit;
        vm.session = sessionService;

        activate();

    /////////////////////////////////////////////////////////////////////////////////////

        function activate () {
            $log.info('*** Activated BookViewController');
            $log.debug('   bookId      => %s', bookId);
            init();
        }

        function canEdit () {
            return sessionService.loggedOn && bookId;
        }

        function edit () {
            $location.path('/books/edit/' + bookId);
        }

        function doDelete () {
            var options = {
                    title: 'Delete Book?',
                    content: 'You are about to delete book "' + vm.book.title + '"'
                },
                modalInstance = $modal.open({
                    controller: 'VerificationController',
                    controllerAs: 'vm',
                    templateUrl: 'app/tmplVerification.html',
                    size: 'sm',
                    resolve: {
                        opts: function () {
                            return options;
                        }
                    }
            });

            modalInstance.result.then(function (response) {
                if (response === 'ok') {
                    bookDataService.deleteItem(bookId)
                        .then(function (data) {
                            $log.info('Deleted Book %o', data);
                            toastr.success('Book deleted');
                            $location.url('/books');
                        }, function (err) {
                            $log.error(err);
                            toastr.error(err.error.code + ' ' + err.error.error);
                        });
                }
            }, function () {
                toastr.info('Delete cancelled by user');
            });
        }

        function init () {
            bookDataService.getItem(bookId)
                .then(function (res) {
                    vm.book = res.data;
                    $log.debug('   vm.book     => %o', vm.book);
                }, function (err) {
                    $log.error(err);
                    toastr.error(err.error.code + ' ' + err.error.error);
                    $location.url('/books');
                });
        }
    }
}());