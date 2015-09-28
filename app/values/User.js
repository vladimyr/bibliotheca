"use strict";

var Ctor = function User(data) {

    this.email = "";
    this.isAdmin = false;
    this.token = "";

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

});

module.exports = function (app) {
    app.value("User", Ctor);
};

