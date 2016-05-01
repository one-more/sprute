'use strict';

module.exports = {
    port: process.env.NODE_PORT || 3000,
    host: process.env.NODE_HOST || 'localhost',
    middleware(server) {
        const morgan = require('morgan'),
            cookieParser = require('cookie-parser'),
            bodyParser = require('body-parser');
        server.use(morgan('dev'));
        server.use(cookieParser());
        server.use(bodyParser.urlencoded({ extended: true }));
        server.use(bodyParser.json())
    }
};