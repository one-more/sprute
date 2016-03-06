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
        this.startServer();
        this.setVars();
        this.loadComponents();
        this.addMiddleware();
        this.registerRoutes();
        return app
    },

    startServer() {
        app.listen(configuration.app.port, configuration.app.host, () => {
            console.log(`start listening ${configuration.app.host}:${configuration.app.port}`)
        });
        app.use(express.static(path.join(__dirname, 'static')));
    },

    setVars() {
        app.set('classPath', process.cwd()+'/back');
        app.set('commonPath', process.cwd()+'/common');
    },

    loadComponents() {
        let components = require('./configuration/components');

        let templateEngine = components.templatesEngine;
        app.set('templateEngine', templateEngine.init());
        let validationEngine = components.validationEngine;
        app.set('validationEngine', validationEngine.init());
    },

    registerRoutes() {
        _.pairs(routes).forEach(pair => {
            let paths = [this.get('commonPath'), this.get('classPath')], path;
            while(path = paths.shift()) {
                try {
                    var router = require(`${path}/routers/${pair[0]}`),
                        routerObj = new router;
                    break
                } catch(e) {}
            }
            if(routerObj) {
                _.pairs(pair[1]).forEach(pair => {
                    let method = routerObj[pair[1]];
                    app.all(pair[0], method.bind(routerObj))
                })
            }
        })
    },

    addMiddleware() {
        app.use(morgan('dev'));
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use(bodyParser.json());
    },

    serverSide(callback) {
        callback()
    },

    clientSide(callback) {

    }
}, app);