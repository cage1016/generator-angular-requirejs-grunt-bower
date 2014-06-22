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