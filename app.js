'use strict';

let express = require('express'),
    app = express(),
    routes = require('./configuration/routes'),
    _ = require('underscore'),
    process = require('process'),
    morgan = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    path = require('path');

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
        let serverConfig = require('./configuration/server');
        app.listen(serverConfig.port, serverConfig.host, () => {
            console.log(`start listening ${serverConfig.host}:${serverConfig.port}`)
        });
        app.use(express.static(path.join(__dirname, 'static')));
    },

    setVars() {
        app.set('classPath', process.cwd()+'/back');
        app.set('commonPath', process.cwd()+'/common');
    },

    loadComponents() {
        let components = require('./configuration/components');

        _.pairs(components).forEach(pair => {
            this.set(pair[0], pair[1].init())
        })
    },

    registerRoutes() {
        _.pairs(routes).forEach(pair => {
            let paths = [this.get('commonPath'), this.get('classPath')], path;
            while(path = paths.shift()) {
                try {
                    var router = require(`${path}/routers/${pair[0]}`),
                        routerObj = new router({
                            routes: pair[1]
                        });
                    break
                } catch(e) {
                    console.log(e)
                }
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