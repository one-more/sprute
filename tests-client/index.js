'use strict';
//
const process = require('process'),
    express = require('express'),
    path = require('path'),
    fs = require('fs'),
    _ = require('underscore'),
    commonPath = path.join(__dirname, 'common'),
    commonEvents = require('../common/events/common');
//
//let app = require('../app');
//

process.chdir('../');

require('../index');

commonEvents.on('init server', () => {
    app.get('server').use(express.static(__dirname));
    app.get('server').use((req, res, next) => {
        app.setVars();
        switch(req.path) {
            case '/rest/query':
                app.set('classPath', commonPath);
                break;
        }
        next()
    });
    const routes = {
            '/page:number': 'page',
            '/data/add': 'addData',
            '/images/upload': 'uploadImages'
        }, routerClass = require(commonPath+'/routers/test'),
        router = new routerClass;
    _.pairs(routes).forEach(pair => {
        const method = router[pair[1]];
        app.get('server').all(pair[0], method.bind(router))
    });
});

commonEvents.on('init i18n', () => {
    const dictionary = {
        'ru': {
            'page1': {
                'wm plurals': ['арбуз', 'арбуза', 'арбузов'],
                'первая страница': 'первая страница'
            }
        },
        'en': {
            'page1': {
                'wm plurals': ['watermelon', 'watermelons', 'watermelons'],
                'первая страница': 'first page'
            }
        }
    };
    const i18n = Object.assign({}, app.get('i18n'), {
        loadSection(section, lang) {
            return dictionary[lang][section]
        }
    });
    app.set('i18n', i18n);
});
//
//let commonPath = path.join(__dirname, 'common');
//
//let registerRoutes = app.registerRoutes.bind(app),
//    loadComponents = app.loadComponents.bind(app);
//
//Object.assign(app, {
//    startServer() {
//        let server = Object.getPrototypeOf(app);
//        let listener = server.listen(8000, 'localhost', () => {
//            console.log(`start listening ${listener.address().host}:${listener.address().port}`)
//        });
//        server.use(express.static(__dirname));
//        server.use(express.static(__dirname+'/static'));
//
//        let setVars = app.setVars;

//
//        try {
//            fs.accessSync(path.join(__dirname, 'static'), fs.F_OK)
//        } catch (e) {
//            fs.symlinkSync(process.cwd()+'/static', path.join(__dirname, 'static'))
//        }
//    },
//
//    registerRoutes() {

//
//        registerRoutes()
//    },
//
//    loadComponents() {
//        loadComponents();
//
//    }
//});
//
//global.app = app;
global.basePath = __dirname;
//app.start();