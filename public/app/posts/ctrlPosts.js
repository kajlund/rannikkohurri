(function (angular, toastr) {
    'use strict';

    angular.module('app').controller('PostsController', ['$scope', '$rootScope', '$log', '$modal', 'PostDataService',
        function ($scope, $rootScope, $log, $modal, PostDataService) {
            $rootScope.spinner.spin();

            PostDataService.getPosts()
                .then(function (data) {
                    $log.info(data);
                    $scope.posts = data;
                    $scope.$apply();
                    $rootScope.spinner.stop();
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