'use strict'
require('dotenv').config()

module.exports = {
    port: process.env.ONEAPP_PORT || 8049,
    protocol: process.env.PROTOCOL || 'https',
    db: {
        name: process.env.DB_NAME || 'ait-db',
        host: process.env.DB_HOST || 'ait-db',
        port: process.env.DB_PORT || 27017
    }
}
