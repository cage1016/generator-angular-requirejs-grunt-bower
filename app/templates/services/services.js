define([
    'angular' <%
    if (ngResource) { %> , 'angular.resource' <%
    } %>
], function(angular) {
    'use strict';
    return angular.module('services', [ <%
        if (ngResource) { %> 'ngResource' <%
        } %>
    ]);
});