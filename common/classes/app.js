'use strict';

const process = require('process'),
    _ = require('underscore'),
    commonEvents = require('../events/common');

module.exports = {
    start() {
        new Promise(resolve => {
            this.clientSide(() => {
                window.addEventListener('load', resolve)
            });
            this.serverSide(resolve)
        }).then(() => {
            this.setVars();
            this.loadComponents();
            this.setRoutes()
        });

        return this
    },

    set(name, val) {
        this[name] = val
    },

    get(name) {
        return this[name]
    },

    setVars() {
        this.set('classPath', '/front');
        this.set('commonPath', process.cwd()+'/common')
    },

    loadComponents() {
        const components = require('../configuration/components');

        _.pairs(components).forEach(pair => {
            this.set(pair[0], pair[1].init());
            commonEvents.emit(`init ${pair[0]}`)
        })
    },

    serverSide(callback) {
        typeof global != 'undefined' && callback()
    },

    clientSide(callback) {
        typeof window != 'undefined' && callback()
    }
};