"use strict";

var Ctor = function Pool(constructor) {
    this.constructor = constructor;
    this.pool = {};
};

Ctor.prototype = {
    getInstance: function (id) {
        return this.pool[id];
    },
    updateInstance: function (id, data) {
        var instance = this.pool[id];
        if (instance) {
            instance.setData(data);
        } else {
            instance = new this.constructor(data);
            this.pool[id] = instance;
        }
        return instance;
    }
};

module.exports = function (app) {
    app.value("Pool", Ctor);
};


