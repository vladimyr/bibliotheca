"use strict";

var deps = ["$rootScope", "$state", "$location", "authService"];

function run($rootScope, $state, $location, authService) {
    //
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
        if ((toState.name === "login" || toState.name === "register") && authService.getUser()) {
            event.preventDefault();
            $state.go("root.home");
        }

        if (toState.name === "login")
            return;

        if (!authService.getUser() && toState.name !== "register") {
            event.preventDefault();
            $state.go("login");
        }
    });
    //
}
run.$inject = deps;

module.exports = function (app) {
    app.run(run);
};