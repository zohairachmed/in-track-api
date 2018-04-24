'use strict';
const Path = require('path');
const debug = require('debug')('auth');

exports.register = function (server, options, next) {

    let swaggerizeHapi = require('swaggerize-hapi');
    swaggerizeHapi.register.attributes.name = 'swagger-auth';
    server.register({
        register: swaggerizeHapi,
        options: {
            api: Path.resolve('./modules/auth/config/swagger.yaml'),
            docspath: '/swagger',  // <-- base path from swagger is prepended
            handlers: Path.resolve('./modules/auth/handlers')
        }
    });

    let hapiSwaggeredUi = require('hapi-swaggered-ui');
    server.register({
        register: hapiSwaggeredUi,
        options: {
            swaggerEndpoint: '/auth/swagger',  // <-- from above with base path from swagger
            path: '/auth/swagger-ui',
            title: 'Auth API',
            swaggerOptions: {},
            auth: false
        }
    });


    next();
};
exports.register.attributes = {
    pkg: require('./package.json')
};