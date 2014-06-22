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