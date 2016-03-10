'use strict';

let process = require('process'),
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore');

let app = require('../app');

process.chdir('../');

let commonPath = path.join(__dirname, 'common');

let registerRoutes = app.registerRoutes.bind(app);

Object.assign(app, {
    startServer() {
        let server = Object.getPrototypeOf(app);
        let listener = server.listen(8000, 'localhost', () => {
            console.log(`start listening ${listener.address().host}:${listener.address().port}`)
        });
        server.use(express.static(__dirname));
        server.use(express.static(__dirname+'/static'));

        let setVars = app.setVars;
        server.use((req, res, next) => {
            setVars();
            switch(req.path) {
                case '/rest/query':
                    app.set('classPath', commonPath);
                    break;
            }
            next()
        });

        try {
            fs.accessSync(path.join(__dirname, 'static'), fs.F_OK)
        } catch (e) {
            fs.symlinkSync(process.cwd()+'/static', path.join(__dirname, 'static'))
        }
    },

    registerRoutes() {
        let routes = {
            '/page1': 'first',
            '/page2': 'second',
            '/data/add': 'addData'
        }, routerClass = require(commonPath+'/routers/test'),
            router = new routerClass;
        _.pairs(routes).forEach(pair => {
            let method = router[pair[1]];
            app.all(pair[0], method.bind(router))
        });

        registerRoutes()
    }
});

global.app = app;
global.basePath = __dirname;
app.start();