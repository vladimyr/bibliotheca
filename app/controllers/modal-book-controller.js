"use strict"

var bookStatusEnum = require("../../enums").bookStatus;

var deps = ["$scope", "$state", "dataService"];

function ctrl($scope, $state, dataService) {
    //
    $scope.bookStatusEnum = bookStatusEnum;
    $scope.statuses = [
        {name: "Not ordered", value: bookStatusEnum.Wishlisted},
        {name: "Ordered", value: bookStatusEnum.Ordered},
        {name: "Available", value: bookStatusEnum.Available}
    ];
    $scope.dropdownStatus = $scope.statuses[0].value;

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

    $scope.changeStatus = function (book, newStatus) {
        if (newStatus == bookStatusEnum.Wishlisted || newStatus == bookStatusEnum.Ordered)
            updateStatusAndSetDropdown(book, newStatus);
        else {
            openSetAvailableModal(book, newStatus);
        }
    };

    function updateStatusAndSetDropdown(book, newStatus) {
        dataService.books.updateStatus(book._id, newStatus)
            .then(function () {
                $scope.dropdownStatus = $scope.statuses[0].value;
            });
    };

    $scope.rentNext = function (book) {
        openRentNextModal(book);
    };

    function openSetAvailableModal(book, newStatus) {
        $scope.setAvailableConfig = {
            title: "Confirm status change",
            message: "Are you sure you want to set status to 'Available'?"+
            " After that, you won't be able to revert to 'Not ordered' or 'Ordered'.",
            ok: function () {
                updateStatusAndSetDropdown(book, newStatus);
                $scope.showSetAvailableModal = false;
            },
            cancel: function () {
                $scope.showSetAvailableModal = false;
            }
        };
        $scope.showSetAvailableModal = true;
    };

    function openWishlistRemoveModal(book) {
        $scope.wishlistRemoveConfig = {
            title: "Confirm wishlist remove",
            message: "Are you sure you want to remove this book from your wishlist?" +
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

    function openRentNextModal(book) {
        var message = "Are you sure you want to unrent "
            + book.title + " from " + book.rentedTo.user;
        if (book.likes.length < 1)
            message += "?";
        else
            message += " and rent it to " + book.likes[0].email + "?";

        $scope.rentNextConfig = {
            title: "Confirm rent",
            message: message,
            ok: function () {
                $scope.showRentNextModal = false;
            },
            cancel: function () {
                $scope.showRentNextModal = false;
            }
        };
        $scope.showRentNextModal = true;
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("ModalBookController", ctrl);
};