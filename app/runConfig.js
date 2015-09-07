"use strict";

var deps = ["$rootScope", "$state", "$location", "authService"];

function run($rootScope, $state, $location, authService) {
    //
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState) {

       
    });
    //
}
run.$inject = deps;

module.exports = function (app) {
    app.run(run);
};