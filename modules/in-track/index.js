'use strict';
const Path = require('path');
const debug = require('debug')('in-track-index');

exports.register = function (server, options, next) {

    let swaggerizeHapi = require('swaggerize-hapi');
    swaggerizeHapi.register.attributes.name = 'swagger-in-track';
    server.register({
        register: swaggerizeHapi,
        options: {
            api: Path.resolve('./modules/in-track/config/swagger.yaml'),
            docspath: '/swagger',  // <-- base path from swagger is prepended
            handlers: Path.resolve('./modules/in-track/handlers')
        }
    });

    let hapiSwaggeredUi = require('hapi-swaggered-ui');
    server.register({
        register: hapiSwaggeredUi,
        options: {
            swaggerEndpoint: '/in-track/swagger',  // <-- from above with base path from swagger
            path: '/in-track/swagger-ui',
            title: 'In-Track API',
            swaggerOptions: {},
            auth: false
        }
    });


    next();
};
exports.register.attributes = {
    pkg: require('./package.json')
};