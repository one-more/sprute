'use strict';

const process = require('process'),
    _ = require('underscore'),
    commonEvents = require('../events/common'),
    configuration = require(process.cwd()+'/configuration/app');

module.exports = {
    start() {
        this.setVars();
        new Promise(resolve => {
            this.clientSide(() => {
                window.addEventListener('load', resolve)
            });
            this.serverSide(resolve)
        }).then(() => {
            configuration.beforeStart();
            this.loadComponents();
            configuration.afterStart();
        }).catch(err => {
            console.log(err)
        });

        return this
    },

    set(name, val) {
        this[name] = val
    },

    get(name) {
        return this[name]
    },

    resolve(name) {
        return new Promise(resolve => {
            if(this[name]) {
                resolve(this[name])
            } else {
                commonEvents.on(`init ${name}`, () => {
                    resolve(this[name])
                })
            }
        })
    },

    setVars() {
        this.clientSide(() => {
            this.set('classPath', '/front')
        });
        this.serverSide(() => {
            this.set('classPath', process.cwd()+'/back')
        });
        this.set('commonPath', process.cwd()+'/common')
    },

    loadComponents() {
        const components = require(process.cwd()+'/configuration/components');

        _.pairs(components).forEach(pair => {
            this.set(pair[0], pair[1].init());
            commonEvents.emit(`init ${pair[0]}`)
        });
        commonEvents.emit('ComponentsLoaded')
    },

    serverSide(callback) {
        typeof global != 'undefined' && callback()
    },

    clientSide(callback) {
        typeof window != 'undefined' && callback()
    }
};