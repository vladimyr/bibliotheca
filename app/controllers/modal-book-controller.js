"use strict"

var deps = ["$scope", "$state", "dataService"];

function ctrl($scope, $state, dataService) {
    //
    //$scope.reverseLike = function (book) {
    //    dataService.books.reverseLike(book._id);
    //};
    $scope.reverseLike = function (book) {
        if (book.isLiked)
            openWishlistRemoveModal(book);
        else
            dataService.books.reverseLike(book._id);
    };
    $scope.edit = function (book) {
        $scope.close();
        $state.go("root.editBook", {id: book._id});
    };
    $scope.remove = function (book) {
        $scope.close();
        dataService.books.remove(book._id)
            .then(function () {
                $state.reload();
            });
    };

    function openWishlistRemoveModal(book) {
        $scope.wishlistRemoveConfig = {
            message:"Are you sure you want to remove this book from your wishlist?" +
            " If you change your mind, you will be added to the end of waiting queue!",
            ok: function () {
                dataService.books.reverseLike(book._id);
                $scope.showWishlistRemoveModal = false;
            },
            cancel: function () {
                $scope.showWishlistRemoveModal = false;
            }
        };
        $scope.showWishlistRemoveModal = true;
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("ModalBookController", ctrl);
};