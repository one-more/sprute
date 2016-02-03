'use strict';

let express = require('express'),
    app = express(),
    configuration = {},
    routes = require('./configuration/routes'),
    _ = require('underscore'),
    process = require('process'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path');

configuration.app = require('./configuration/app');

module.exports = Object.setPrototypeOf({

    start() {
        app.listen(configuration.app.port, configuration.app.host, () => {
            console.log(`start listening ${configuration.app.host}:${configuration.app.port}`)
        });
        app.use(express.static(path.join(__dirname, 'static')));
        this.setVars();
        this.addMiddleware();
        this.registerRoutes();
        return app
    },

    setVars() {
        app.set('classPath', process.cwd()+'/back');
        app.set('commonPath', process.cwd()+'/common');

        let templateEngine = require('./common/modules/template-engine/index');
        app.set('templateEngine', templateEngine.init());
    },

    registerRoutes() {
        _.pairs(routes).forEach(pair => {
            let router = require(`./common/routers/${pair[0]}`),
                routerObj = new router;
            _.pairs(pair[1]).forEach(pair => {
                app.all(pair[0], routerObj[pair[1]].bind(routerObj))
            })
        })
    },

    addMiddleware() {
        app.use(morgan('dev'));
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
    }
}, app);