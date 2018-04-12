'use strict';

var dog = require('./dog');
var amazon = require('./amazon');
var fleetfarm = require('./fleetfarm');
var intrack = require('./in-track');
var walmart = require('./walmart');


module.exports = [].concat(dog, amazon, fleetfarm, intrack, walmart);