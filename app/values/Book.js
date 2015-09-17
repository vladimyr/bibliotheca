"use strict";

var Ctor = function Book(data) {

    this.title = "";
    this.author = "";
    this.description = "";
    this.pages = 0;
    this.isbn10 = "";
    this.isbn13 = "";
    this.amazonUrl = "";
    this.imageUrl = "";
    this.user = "";
    this.likes = [];
    this.likeNumber = 0;
    this.isLiked = false;

    if (data) {
        this.setData(data);
    }

};

Ctor.prototype = {
    setData: function (data) {
        angular.extend(this, data);
    }
};

Object.defineProperties(Ctor.prototype, {
    "shortDesc": {
        get: function () {
            if (this.description.length > 180)
                return this.description.substring(0, 180) + "...";
            else
                return "";
        }
    }
});

module.exports = function (app) {
    app.value("Book", Ctor);
};

