'use strict';

require([
        'angular',
        'app',
        'domReady',
        'controllers/home-controller',
        'bootstrap'
    ],
    function(angular, app, domReady) {
        var root = require.toUrl('.').split('.')[0];
        app.config([
            '$routeProvider', '$httpProvider', '$sceDelegateProvider', '$locationProvider',
            function($routeProvider, $httpProvider, $sceDelegateProvider, $locationProvider) {
                // sec
                $sceDelegateProvider.resourceUrlWhitelist(['self', '.*']);

                // route
                $routeProvider.
                when('/', {
                    templateUrl: '<% if (hasVirtualDirectory===true) { %>/<%= applicationName %><% } %>/public/js/views/Home/partials/home-index.html',
                    controller: 'HomeCtrl',
                    resolve: {}
                }).
                otherwise({
                    redirectTo: '/'
                });
            }
        ]).run([
            '$rootScope',
            function($rootScope) {
                // global variable
                $rootScope.youAre = youAre;

                $rootScope.$safeApply = function($scope, fn) {
                    $scope = $scope || $rootScope;
                    fn = fn || function() {};
                    if ($scope.$$phase) {
                        fn();
                    } else {
                        $scope.$apply(fn);
                    }
                };
            }
        ]).constant('$', $);

        domReady(function() {
            angular.bootstrap(document.body, ['<%= ngapp %>']);

            $('html').addClass('ng-app: <%= ngapp %>');
        });
    }
);