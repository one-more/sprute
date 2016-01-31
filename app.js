'use strict';

let express = require('express'),
    templateEngine = require('./common/modules/template-engine/index'),
    app = express(),
    configuration = {},
    routes = require('./configuration/routes'),
    _ = require('underscore'),
    getRouter = require('./common/routers/get'),
    routers = {
        getRouter: new getRouter(app)
    };

configuration.app = require('./configuration/app');

module.exports = {
    start() {
        app.listen(configuration.app.port, configuration.app.host, () => {
            console.log(`start listening ${configuration.app.host}:${configuration.app.port}`)
        });
        app.set('templateEngine', templateEngine.init());
        this.registerRoutes();
        return app
    },

    registerRoutes() {
        _.pairs(routes).forEach(pair => {
            let [router, method] = pair[1];
            app.all(pair[0], routers[router][method].bind(router[router]))
        })
    }
};