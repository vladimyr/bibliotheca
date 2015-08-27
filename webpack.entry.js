'use strict';

//require("angular");
require("bootstrap/dist/css/bootstrap.css");

var jQuery = require("jquery");
require("bootstrap");

var $ = jQuery;
//window.$ = jQuery;

$(document).ready(function(){

    $('button').click(function(){
        alert('It works!');
    });
});
