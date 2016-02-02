'use strict';

let express = require('express'),
    templateEngine = require('./common/modules/template-engine/index'),
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
        app.set('templateEngine', templateEngine.init());
        app.set('classPath', process.cwd()+'/back');
        app.set('commonPath', process.cwd()+'/common');
        app.set('theme', configuration.app.theme);
    },

    registerRoutes() {
        let getRouter = require('./common/routers/get'),
            getRouterObj = new getRouter();

        _.pairs(routes.getRouter).forEach(pair => {
            app.all(pair[0], getRouterObj[pair[1]].bind(getRouterObj))
        })
    },

    addMiddleware() {
        app.use(morgan('dev'));
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
    }
}, app);