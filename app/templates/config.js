require.config({
    baseUrl: "<% if (hasVirtualDirectory===true) { %>/<%= applicationName %><% } %>/Public/js",
    waitSeconds: 200,
    paths: {
        'angular': 'vendor/angular/angular.min',
        'jquery': 'vendor/jquery/jquery.min',
        'moment': 'vendor/momentjs/min/moment.min',
        'respond': 'vendor/respond/dest/respond.src',
        'domReady': 'vendor/requirejs-domready/domReady',
        'bootstrap': 'vendor/bootstrap/dist/js/bootstrap.min',
        <%= requirePath %>
    },
    shim: {
        'moment': {
            exports: 'moment'
        },
        'angular': {
            deps: ['jquery', 'moment'],
            exports: 'angular'
        },
        'respond': {
            exports: 'respond'
        },

        'bootstrap': {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        <%= requireShim %>
    },
    urlArgs: "bust=" + (new Date()).getTime()
    //urlArgs: "bust=v4"
});