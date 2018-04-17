'use strict';
const Config = require('../../config');
const mongoose = require('mongoose');
const debug = require('debug')('MongoProvider');

module.exports = function () {
    debug('MongoProvider - Initializing connection');

    let dbURI = `mongodb://${Config.db.host}:${Config.db.port}/${Config.db.name}`;

    mongoose.connect(dbURI, {
        server: {
            auto_reconnect: true
        }
    })
    let db = mongoose.connection;

    db.on('connecting', function () {
        debug('connecting to MongoDB...');
    });

    db.on('error', function (error) {
        debug('Error in MongoDb connection: ' + error);
        mongoose.disconnect();
    });
    db.on('connected', function () {
        debug('MongoDB connected!');
    });
    db.once('open', function () {
        debug('MongoDB connection opened!');
    });
    db.on('reconnected', function () {
        debug('MongoDB reconnected!');
    });
    db.on('disconnected', function () {
        debug('MongoDB disconnected! Attempting to reconnect...');
        mongooseConnectionPromise = mongoose.connect(dbURI, {
            server: {
                auto_reconnect: true
            }
        });
    });

    let mongooseConnectionPromise = new Promise(function (resolve, reject) {
        resolve()
    });

    return {
        connectionPromise: mongooseConnectionPromise
    };
}();