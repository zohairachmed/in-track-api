'use strict';
const Path = require('path');
const debug = require('debug')('inventory-index');

exports.register = function (server, options, next) {

    let swaggerizeHapi = require('swaggerize-hapi');
    swaggerizeHapi.register.attributes.name = 'swagger-inventory';
    server.register({
        register: swaggerizeHapi,
        options: {
            api: Path.resolve('./modules/inventory/config/swagger.json'),
            docspath: '/inventory/swagger',  // <-- base path from swagger is prepended
            handlers: Path.resolve('./modules/inventory/handlers')
        }
    });

    let hapiSwaggeredUi = require('hapi-swaggered-ui');
    server.register({
        register: hapiSwaggeredUi,
        options: {
            swaggerEndpoint: '/inventory/swagger',  // <-- from above with base path from swagger
            path: '/inventory/swagger-ui',
            title: 'Inventory API',
            swaggerOptions: {},
            auth: false
        }
    });


    next();
};
exports.register.attributes = {
    pkg: require('./package.json')
};