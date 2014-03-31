(function (angular, Parse) {
    'use strict';

    Parse.initialize("HZAMesseJ6CDe1K5dFLfxbGbMYD6aV3lBaEp3Ib1",
        "BxuS4AKpUCoP6Ea6pOn1O0PXlmPu5wYvvlSxLJVE");

    angular.module('app').factory('PostDataService', ['$log', '$q',
        function ($log, $q) {
            var res = {},
                PostModel = Parse.Object.extend({
                    className: 'Post'
                });

            res.getPost = function (aId) {
                var qry = new Parse.Query(PostModel);
                return qry.get(aId);
            };

            res.getPosts = function () {
                var qry = new Parse.Query(PostModel);
                qry.equalTo("published", true);
                qry.descending("publishDate");
                return qry.find();
            };

            res.deletePost = function (post) {
                return post.destroy();
            };

            return res;
        }]);
}(angular, Parse));