'use strict';

try {
    var Backbone = require('Backbone')
} catch(e) {
    Backbone = {}
}

module.exports = class extends Backbone.View {
    setTemplateDir(path) {
        this.templateDirs = [path]
    }

    addTemplateDir(path) {
        !this.templateDirs && (this.templateDirs = []);
        this.templateDirs.push(path)
    }

    getTemplate(name, data) {

    }
};