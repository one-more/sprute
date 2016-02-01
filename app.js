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
        app.set('templateEngine', templateEngine.init());
        app.set('classPath', process.cwd()+'/back');
        app.set('theme', configuration.app.theme);
        this.addMiddleware();
        this.registerRoutes();
        return app
    },

    registerRoutes() {
        let getRouter = require('./common/routers/get'),
            routers = {
                getRouter: new getRouter()
            };

        _.pairs(routes).forEach(pair => {
            let router = pair[1][0],
                method = pair[1][1];
            app.all(pair[0], routers[router][method].bind(routers[router]))
        })
    },

    addMiddleware() {
        app.use(morgan('dev'));
        app.use(cookieParser());
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(bodyParser.json());
    }
}, app);