define([ <%= angularDependencyModules %> ], function(angular) {
    return angular.module('<%= ngapp %>', [ <%= angularModules %> ]);
});