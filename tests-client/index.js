'use strict';

let process = require('process'),
    express = require('express'),
    path = require('path'),
    fs = require('fs');

let app = require('../app');

process.chdir('../');

Object.assign(app, {
    startServer() {
        let server = Object.getPrototypeOf(app);
        let listener = server.listen(8000, 'localhost', () => {
            console.log(`start listening ${listener.address().host}:${listener.address().port}`)
        });
        server.use(express.static(__dirname));

        let setVars = app.setVars;
        server.use((req, res, next) => {
            setVars();
            switch(req.path) {
                case '/rest/query':
                    app.set('classPath', path.join(__dirname, 'common'));
                    break;
            }
            next()
        });

        try {
            fs.accessSync(path.join(__dirname, 'static'), fs.F_OK)
        } catch (e) {
            fs.symlinkSync(process.cwd()+'/static', path.join(__dirname, 'static'))
        }
    }
});

global.app = app;
app.start();