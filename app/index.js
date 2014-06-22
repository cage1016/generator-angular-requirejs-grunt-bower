'use strict';

var path = require('path');
var util = require('util');
var yeoman = require('yeoman-generator');
var chalk = require('chalk');

var Generator = module.exports = function Generator(args, options, config) {
    yeoman.generators.Base.apply(this, arguments);

    // set source root path to templates
    this.sourceRoot(path.join(__dirname, 'templates'));
};

util.inherits(Generator, yeoman.generators.Base);

Generator.prototype.welcome = function welcome() {
    // welcome message
    if (!this.options['skip-welcome-message']) {
        console.log(this.yeoman);
        console.log(
            'Out of the box I include Bootstrap and some AngularJS recommended modules.\n'
        );
    }
};

Generator.prototype.createFolder = function createFolder() {
    // create folders
    this.mkdir('Public');
    this.mkdir('Public/js/controllers');
    this.mkdir('Public/js/directives');
    this.mkdir('Public/js/filters');
    this.mkdir('Public/js/services');
    this.mkdir('Public/js/css/bootstrap/css');
    this.mkdir('Public/js/css/bootstrap/fonts');
    this.mkdir('Public/js/views/Home/partials');
    this.mkdir('Helpers');
};

Generator.prototype.askForVirtualDirectory = function askForVirtualDirectory() {
    var cb = this.async();

    var prompts = [{
        name: 'hasVirtualDirectory',
        message: 'Do your ASP.NET MVC Appliation run in virtualDirectory? (http://localhost/ApplicationName)',
        default: true
    }];

    this.prompt(prompts, function (props) {
        this.env.options.hasVirtualDirectory = props.hasVirtualDirectory;

        cb();
    }.bind(this));
}

Generator.prototype.askApplicationName = function askApplicationName() {
    var cb = this.async();
    var prompts;
    if (this.env.options.hasVirtualDirectory === true) {
        prompts = [{
            name: 'applicationName',
            message: 'What would you like to call Appliation name? (http://localhost/ApplicationName)',
            default: 'ApplicationName'
        }];
    } else {
        prompts = [];
    }

    this.prompt(prompts, function (props) {
        this.env.options.applicationName = props.applicationName;

        cb();
    }.bind(this));
};

Generator.prototype.askForModules = function askForModules() {
    var cb = this.async();

    var prompts = [{
        name: 'ngapp',
        message: 'What would you like to call AngularJS Appliation?',
        default: 'myAngularApp'
    }, {
        type: 'checkbox',
        name: 'modules',
        message: 'Which modules would you like to include? (angular-route.js module is required!)',
        choices: [{
            value: 'animateModule',
            name: 'angular-animate.js',
            checked: true
        }, {
            value: 'cookiesModule',
            name: 'angular-cookies.js',
            checked: true
        }, {
            value: 'resourceModule',
            name: 'angular-resource.js',
            checked: true
        },
            //  {
            //     value: 'routeModule',
            //     name: 'angular-route.js',
            //     checked: true
            // },
            {
                value: 'sanitizeModule',
                name: 'angular-sanitize.js',
                checked: true
            }, {
                value: 'touchModule',
                name: 'angular-touch.js',
                checked: true
            }, {
                value: 'uiBootstrap',
                name: 'ui-bootstrap.js',
                checked: true
            }
        ]
    }];

    this.prompt(prompts, function (props) {
        var hasMod = function (mod) {
            return props.modules.indexOf(mod) !== -1;
        };
        this.animateModule = hasMod('animateModule');
        this.cookiesModule = hasMod('cookiesModule');
        this.resourceModule = hasMod('resourceModule');
        this.routeModule = hasMod('routeModule');
        this.sanitizeModule = hasMod('sanitizeModule');
        this.touchModule = hasMod('touchModule');
        this.uiBootstrapModule = hasMod('uiBootstrap');
        this.ngapp = props.ngapp.replace(/\"/g, '\\"');

        var angMods = [];
        var angDeps = [];

        if (this.animateModule) {
            angMods.push("'ngAnimate'");
            this.env.options.ngAnimate = true;
            angDeps.push("'angular.animate'");
        }

        if (this.cookiesModule) {
            angMods.push("'ngCookies'");
            this.env.options.ngCookies = true;
            angDeps.push("'angular.cookies'");
        }

        if (this.resourceModule) {
            angMods.push("'ngResource'");
            this.env.options.ngResource = true;
            angDeps.push("'angular.resource'");
        }

        if (this.routeModule || true) {
            angMods.push("'ngRoute'");
            this.env.options.ngRoute = true;
            angDeps.push("'angular.route'");
        }

        if (this.sanitizeModule) {
            angMods.push("'ngSanitize'");
            this.env.options.ngSanitize = true;
            angDeps.push("'angular.sanitize'");
        }

        if (this.touchModule) {
            angMods.push("'ngTouch'");
            this.env.options.ngTouch = true;
            angDeps.push("'angular-touch'");
        }
        if (this.uiBootstrapModule) {
            this.env.options.uiBootstrap = true;
            angMods.push("'ui.bootstrap'");
            angDeps.push("'uiBootstrapTpl'");
            angDeps.push("'uiBootstrap'");
        }

        this.angMods = angMods;
        this.angDeps = angDeps;

        cb();
    }.bind(this));
};

Generator.prototype.commonConfig = function commonConfig() {
    //anguar dependency
    this.angDeps = [
        "'angular'",
        "'respond'",
        "'controllers/controllers'",
        "'filters/filters'",
        "'directives/directives'",
        "'services/services'",
    ].concat(this.angDeps);

    //angular Modules
    this.angMods = [
        "'controllers'",
        "'filters'",
        "'directives'",
        "'services'",
    ].concat(this.angMods);

    this.env.options.angDeps = '\n    ' + this.angDeps.join(',\n    ') + '\n  ';
    this.env.options.angMods = '\n        ' + this.angMods.join(',\n        ') + '\n  ';

    // bower devDependencies
    // requirejs config

    this.bowerDeps = [];
    this.requirePath = [];
    this.requireShim = [];
    if (this.env.options.ngAnimate) {
        this.bowerDeps.push('"angular-animate": "~1.2.16"');
        this.requirePath.push("'angular.animate': 'vendor/angular-animate/angular-animate.min'");
        this.requireShim.push("'angular.animate': ['angular']");
    }
    if (this.env.options.ngCookies) {
        this.bowerDeps.push('"angular-cookies": "1.2.16"');
        this.requirePath.push("'angular.cookies': 'vendor/angular-cookies/angular-cookies.min'");
        this.requireShim.push("'angular.cookies': ['angular']");
    }
    if (this.env.options.ngResource) {
        this.bowerDeps.push('"angular-resource": "~1.2.16"');
        this.requirePath.push("'angular.resource': 'vendor/angular-resource/angular-resource.min'");
        this.requireShim.push("'angular.resource': ['angular']");
    }
    if (this.env.options.ngRoute) {
        this.bowerDeps.push('"angular-route": "~1.2.16"');
        this.requirePath.push("'angular.route': 'vendor/angular-route/angular-route.min'");
        this.requireShim.push("'angular.route': ['angular']");
    }
    if (this.env.options.ngSanitize) {
        this.bowerDeps.push('"angular-sanitize": "~1.2.16"');
        this.requirePath.push("'angular.sanitize': 'vendor/angular-sanitize/angular-sanitize.min'");
        this.requireShim.push("'angular.sanitize': ['angular']");
    }
    if (this.env.options.ngTouch) {
        this.bowerDeps.push('"angular-touch": "~1.2.18"');
        this.requirePath.push("'angular-touch': 'vendor/angular-touch/angular-touch.min'");
        this.requireShim.push("'angular-touch': ['angular']");
    }
    if (this.env.options.uiBootstrap) {
        this.bowerDeps.push('"angular-ui-bootstrap-bower": "~0.11.0"');
        this.requirePath.push("'uiBootstrap': 'vendor/angular-ui-bootstrap-bower/ui-bootstrap.min'");
        this.requirePath.push("'uiBootstrapTpl':'vendor/angular-ui-bootstrap-bower/ui-bootstrap-tpls.min'");
        this.requireShim.push("'uiBootstrap': { deps: ['angular', 'bootstrap'], exports: 'uiBootstrap' }");
        this.requireShim.push("'uiBootstrapTpl': { deps: ['angular', 'uiBootstrap'] }");
    }

    this.env.options.bowerDeps = '\n        ' + this.bowerDeps.join(',\n        ');
    this.env.options.requirePath = '\n        ' + this.requirePath.join(',\n        ');
    this.env.options.requireShim = '\n        ' + this.requireShim.join(',\n        ');
};

Generator.prototype.angularMods = function angularMods() {
    this.angularModules = this.env.options.angMods;
    this.angularDependencyModules = this.env.options.angDeps;
    this.bowerDevDependencies = this.env.options.bowerDeps;
    this.requirePath = this.env.options.requirePath;
    this.requireShim = this.env.options.requireShim;

    this.ngResource = this.env.options.ngResource;

    this.applicationName = this.env.options.applicationName;
    this.hasVirtualDirectory = this.env.options.hasVirtualDirectory;

    // copy angular folders
    this.template('controllers/controllers.js', 'Public/js/controllers/controllers.js');
    this.copy('controllers/home-controller.js', 'Public/js/controllers/home-controller.js');
    this.template('directives/directives.js', 'Public/js/directives/directives.js');
    this.template('filters/filters.js', 'Public/js/filters/filters.js');
    this.template('services/services.js', 'Public/js/services/services.js');
    this.template('app.js', 'Public/js/app.js');
    this.template('config.js', 'Public/js/config.js');
};

Generator.prototype.setBower = function setBower() {
    this.copy('bowerrc', 'Public/.bowerrc');
    this.template('_bower.json', 'Public/bower.json');
};

Generator.prototype.requireHelpers = function requireHelpers() {
    // copy ASP.NET MVC RequireHelpers.cs
    this.template('RequireHelpers.cs', 'Helpers/RequireHelpers.cs')
};

Generator.prototype.gruntfile = function gruntfile() {
    var replaceInArray = function (str) {
        return str.replace(/ /g, '');
    };
    var convert2Str = function (object) {
        return JSON.stringify(object);
    };

    var files = [{
        expand: true,
        cwd: '<%= mvc.js %>/vendor/angular/',
        src: 'angular.js',
        dest: '<%= mvc.tmp %>/vendor'
    }, {
        expand: true,
        cwd: '<%= mvc.js %>/vendor/jquery/',
        src: 'jquery.min.js',
        dest: '<%= mvc.tmp %>/vendor'
    }, {
        expand: true,
        cwd: '<%= mvc.js %>/vendor/momentjs/min',
        src: 'moment.min.js',
        dest: '<%= mvc.tmp %>/vendor'
    }, {
        expand: true,
        cwd: '<%= mvc.js %>/vendor/respond/src',
        src: 'respond.js',
        dest: '<%= mvc.tmp %>/vendor'
    }, {
        expand: true,
        cwd: '<%= mvc.js %>/vendor/requirejs-domready',
        src: 'domReady.js',
        dest: '<%= mvc.tmp %>/vendor'
    }, {
        expand: true,
        cwd: '<%= mvc.js %>/vendor/bootstrap/dist/js',
        src: 'bootstrap.min.js',
        dest: '<%= mvc.tmp %>/vendor'
    }];

    var gruntFileRequirejsPath = [];
    if (this.env.options.ngAnimate) {
        files.push({
            expand: true,
            cwd: '<%= mvc.js %>/vendor/angular-animate/',
            src: 'angular-animate.js',
            dest: '<%= mvc.tmp %>/vendor'
        });
        gruntFileRequirejsPath.push("'angular.animate': '../<%= mvc.tmp %>/vendor/angular-animate'");
    }
    if (this.env.options.ngCookies) {
        files.push({
            expand: true,
            cwd: '<%= mvc.js %>/vendor/angular-cookies/',
            src: 'angular-cookies.js',
            dest: '<%= mvc.tmp %>/vendor'
        });
        gruntFileRequirejsPath.push("'angular.cookies': '../<%= mvc.tmp %>/vendor/angular-cookies'");
    }
    if (this.env.options.ngResource) {
        files.push({
            expand: true,
            cwd: '<%= mvc.js %>/vendor/angular-resource/',
            src: 'angular-resource.js',
            dest: '<%= mvc.tmp %>/vendor'
        });
        gruntFileRequirejsPath.push("'angular.resource': '../<%= mvc.tmp %>/vendor/angular-resource'");
    }
    if (this.env.options.ngRoute) {
        files.push({
            expand: true,
            cwd: '<%= mvc.js %>/vendor/angular-route/',
            src: 'angular-route.js',
            dest: '<%= mvc.tmp %>/vendor'
        });
        gruntFileRequirejsPath.push("'angular.route': '../<%= mvc.tmp %>/vendor/angular-route'");
    }
    if (this.env.options.ngSanitize) {
        files.push({
            expand: true,
            cwd: '<%= mvc.js %>/vendor/angular-sanitize/',
            src: 'angular-sanitize.js',
            dest: '<%= mvc.tmp %>/vendor'
        });
        gruntFileRequirejsPath.push("'angular.sanitize': '../<%= mvc.tmp %>/vendor/angular-sanitize'");
    }
    if (this.env.options.ngTouch) {
        files.push({
            expand: true,
            cwd: '<%= mvc.js %>/vendor/angular-touch/',
            src: 'angular-touch.js',
            dest: '<%= mvc.tmp %>/vendor'
        });
        gruntFileRequirejsPath.push("'angular-touch': '../<%= mvc.tmp %>/vendor/angular-touch'");
    }
    if (this.env.options.uiBootstrap) {
        files.push({
            expand: true,
            cwd: '<%= mvc.js %>/vendor/bootstrap/dist/js',
            src: 'bootstrap.min.js',
            dest: '<%= mvc.tmp %>/vendor'
        });
        files.push({
            expand: true,
            cwd: '<%= mvc.js %>/vendor/angular-ui-bootstrap-bower',
            src: ['ui-bootstrap.min.js', 'ui-bootstrap-tpls.min.js'],
            dest: '<%= mvc.tmp %>/vendor'
        });
        gruntFileRequirejsPath.push("'uiBootstrap': '../<%= mvc.tmp %>/vendor/ui-bootstrap.min'");
        gruntFileRequirejsPath.push("'uiBootstrapTpl': '../<%= mvc.tmp %>/vendor/ui-bootstrap-tpls.min'");
    }

    this.files = files.map(convert2Str).map(replaceInArray);
    this.gruntFileRequirejsPath = gruntFileRequirejsPath.map(replaceInArray).join(',\n                        ');

    this.template('Gruntfile.js', 'Public/Gruntfile.js');
};

Generator.prototype.packageJSON = function packageJSON() {
    this.template('_package.json', 'Public/package.json');
};

Generator.prototype.jshint = function jshint() {
    this.copy('jshintrc', 'Public/.jshintrc');
};

Generator.prototype.assets = function assets() {
    this.template('css/bootstrap/css/bootstrap.min.css', 'Public/js/css/bootstrap/css/bootstrap.min.css');
    this.template('css/bootstrap/css/bootstrap.css', 'Public/js/css/bootstrap/css/bootstrap.css');
    this.template('css/bootstrap/fonts/glyphicons-halflings-regular.eot', 'Public/js/css/bootstrap/fonts/glyphicons-halflings-regular.eot');
    this.template('css/bootstrap/fonts/glyphicons-halflings-regular.svg', 'Public/js/css/bootstrap/fonts/glyphicons-halflings-regular.svg');
    this.template('css/bootstrap/fonts/glyphicons-halflings-regular.ttf', 'Public/js/css/bootstrap/fonts/glyphicons-halflings-regular.ttf');
    this.template('css/bootstrap/fonts/glyphicons-halflings-regular.woff', 'Public/js/css/bootstrap/fonts/glyphicons-halflings-regular.woff');
};

Generator.prototype.views = function views() {
    this.copy('views/Home/partials/home-index.html', 'Public/js/views/Home/partials/home-index.html');
    this.template('views/Home/index.js', 'Public/js/views/Home/index.js');
};